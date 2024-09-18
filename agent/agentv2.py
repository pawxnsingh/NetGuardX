from scapy.all import sniff, Raw, IP, TCP, send
import scapy.all as scapy
from scapy.layers.http import HTTPRequest, HTTP
from scapy.sessions import TCPSession
import urllib.parse
from argparse import ArgumentParser
import re
import logging
from datetime import datetime
import socket
import threading
import ssl

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

def detect_xss_attack(payload):
    # URL-decode the payload first
    decoded_payload = urllib.parse.unquote(payload)
    
    # Convert to lowercase for case-insensitive matching
    lowercase_payload = decoded_payload.lower()
    
   # List of XSS patterns
    xss_patterns = [
        r'<script.*?>',  # Basic <script> tag
        r'javascript:',  # JavaScript protocol in URI
        r'on\w+\s*=',  # Event handlers (e.g., onclick=)
        r'(\\x[0-9A-Fa-f]{2})+',  # Hex-encoded characters
        r'&#x?[0-9A-Fa-f]+;',  # HTML entity encoding
        r'data:.*?base64',  # Data URI with base64
        r'<img[^>]*src=[^>]+>',  # Potentially malicious image tags
        r'<iframe[^>]*src=[^>]+>',  # Iframe injection
        r'<svg.*?on\w+\s*=',  # SVG with event handlers
        r'expression\s*\(',  # CSS expression
        r'url\s*\(',  # CSS url() function
        r'@import',  # CSS @import
        r'<meta[^>]*>',  # Malicious meta tags
        r'<link[^>]*>',  # Malicious link tags
        r'<style[^>]*>',  # Inline styles that might contain malicious code
        r'<object[^>]*>',  # Object tags that might contain malicious code
        r'<embed[^>]*>',  # Embed tags that might contain malicious code
        r'<applet[^>]*>',  # Applet tags (old, but still relevant)
        r'document\.cookie',  # Attempts to access cookies
        r'document\.location',  # Attempts to redirect
        r'window\.location',  # Another redirection attempt
        r'eval\s*\(',  # eval() function calls
        r'settimeout\s*\(',  # setTimeout() function calls
        r'setinterval\s*\(',  # setInterval() function calls
        r'alert\s*\(',  # alert() function calls (often used in XSS proofs of concept)
    ]
    
    # Check each pattern
    for pattern in xss_patterns:
        if re.search(pattern, lowercase_payload):
            return True
    
    return False

# ---------------------------------


def policy_enforcer(src_ip):
    if src_ip in BLACKLISTED_IPS:
        logging.warning(f"Blocked request from blacklisted IP: {src_ip}")
        return False
    return True

def forward_request(client_socket, request, address):
    try:
        # Parse the request to get the host and port
        first_line = request.split('\n')[0]
        url = first_line.split(' ')[1]
        http_pos = url.find("://")
        if http_pos == -1:
            temp = url
        else:
            temp = url[(http_pos+3):]
        port_pos = temp.find(":")
        webserver_pos = temp.find("/")
        if webserver_pos == -1:
            webserver_pos = len(temp)
        webserver = ""
        port = -1
        if port_pos == -1 or webserver_pos < port_pos:
            port = 80
            webserver = temp[:webserver_pos]
        else:
            port = int((temp[(port_pos+1):])[:webserver_pos-port_pos-1])
            webserver = temp[:port_pos]

        # Create a socket to connect to the webserver
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((webserver, port))
        s.send(request.encode())

        # Receive the response from the webserver
        while 1:
            data = s.recv(8192)
            if len(data) > 0:
                client_socket.send(data)
            else:
                break
        s.close()
        client_socket.close()
    except Exception as e:
        logging.error(f"Error forwarding request: {str(e)}")
        if s: # type: ignore
            s.close()
        if client_socket:
            client_socket.close()

def handle_client_request(client_socket, client_address):
    request = client_socket.recv(8192).decode()
    src_ip = client_address[0]

    if not policy_enforcer(src_ip):
        client_socket.close()
        return

    # Check for SQL injection
    if detect_xss_attack(request):
        logging.warning(f"XSS Injection detected from {src_ip}. Request blocked.")
        client_socket.close()
        return

    # Log the allowed request
    log_message = f"ALLOWED - IP: {src_ip}, Request: {request.splitlines()[0]}"
    logging.info(log_message)
    print(log_message)

    # Forward the request
    threading.Thread(target=forward_request, args=(client_socket, request, client_address)).start()

def start_proxy(port):
    proxy_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    proxy_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    proxy_socket.bind(('', port))
    proxy_socket.listen(10)
    print(f"Proxy listening on port {port}")

    while True:
        try:
            client_socket, client_address = proxy_socket.accept()
            threading.Thread(target=handle_client_request, args=(client_socket, client_address)).start()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logging.error(f"Error accepting connection: {str(e)}")

    proxy_socket.close()

if __name__ == "__main__":
    start_proxy(args.port)
