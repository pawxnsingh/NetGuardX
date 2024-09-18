from scapy.all import send

def forward_packet(packet):
    # Remove any fields added by our interception
    if packet.haslayer(IP):
        del packet[IP].chksum
    if packet.haslayer(TCP):
        del packet[TCP].chksum
    
    # Forward the packet
    send(packet, verbose=False)