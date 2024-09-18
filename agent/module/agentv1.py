from scapy.all import sniff, Raw, send
import scapy.all as scapy
from scapy.layers.http import HTTPRequest, HTTP
from scapy.layers.inet import IP, TCP
from scapy.sessions import TCPSession
import urllib.parse
from argparse import ArgumentParser
import re
import logging
from datetime import datetime

parser = ArgumentParser()
parser.add_argument('--port', type=int, default=5000, help='Defines which port to sniff')
args = parser.parse_args()

scapy.packet.bind_layers(TCP, HTTP, dport=args.port)
scapy.packet.bind_layers(TCP, HTTP, sport=args.port)

# Setup logging
logging.basicConfig(filename='http_sniffer.log', level=logging.INFO,
                    format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

# Blacklisted IPs (for demonstration, you should load this from a file in a real scenario)
BLACKLISTED_IPS = ['192.168.1.100', '10.0.0.50']

# Simple SQL injection detection function
def detect_sql_injection(payload):
    sql_patterns = [
        r'\bUNION\b.*\bSELECT\b',
        r'\bOR\b.*\b1\s*=\s*1\b',
        r'\bDROP\b.*\bTABLE\b',
        r"'.*\bOR\b.*'='",
        r'\bSELECT\b.*\bFROM\b.*\bWHERE\b'
    ]
    return any(re.search(pattern, payload, re.IGNORECASE) for pattern in sql_patterns)

def policy_enforcer(packet):
    if IP in packet:
        src_ip = packet[IP].src
        if src_ip in BLACKLISTED_IPS:
            logging.warning(f"Blocked request from blacklisted IP: {src_ip}")
            return True  # Drop the packet
    return False  # Allow the packet

def sniffing_function(packet):
    if packet.haslayer(HTTPRequest):
        # Apply policy enforcer
        if policy_enforcer(packet):
            return

        # Extract request details
        src_ip = packet[IP].src if IP in packet else 'localhost'
        host = packet[HTTPRequest].Host.decode() if packet[HTTPRequest].Host else ''
        path = packet[HTTPRequest].Path.decode() if packet[HTTPRequest].Path else ''
        method = packet[HTTPRequest].Method.decode() if packet[HTTPRequest].Method else ''
        
        # Check for SQL injection
        payload = path + (packet[Raw].load.decode() if packet.haslayer(Raw) else '')
        if detect_sql_injection(payload):
            logging.warning(f"SQL Injection detected from {src_ip}. Request dropped.")
            return  # Drop the packet
        
        # Log the allowed request
        log_message = f"ALLOWED - IP: {src_ip}, Method: {method}, Host: {host}, Path: {path}"
        logging.info(log_message)
        print(log_message)  # Also print to console for demonstration

# Start sniffing
print(f"Starting HTTP sniffer on port {args.port}")
pkgs = sniff(
    prn=sniffing_function,
    iface='lo',
    filter=f'port {args.port} and inbound',
    session=TCPSession
)

print("Sniffing complete")
