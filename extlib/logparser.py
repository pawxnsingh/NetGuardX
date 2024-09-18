from xml.etree import ElementTree as ET
import urllib.parse
import sys
import base64
import csv

# Paths to log and csv files
log_path = r"C:\Users\Pawan Singh\Desktop\FIREWALL\QuantMagma\extlib\badRequest"
csv_path = r"C:\Users\Pawan Singh\Desktop\FIREWALL\QuantMagma\extlib\bad.csv"
class_flag = "Bad"

# Class to parse the log
class LogParse:
    def __init__(self):
        pass

    def parse_log(self, log_path):
        '''
        This function accepts Burp log file path and returns a dict of requests and responses.
        result = {'GET /page.php...':'200 OK HTTP / 1.1....', '':'', .....}
        '''
        result = {}
        try:
            with open(log_path): pass
        except IOError:
            print("[+] Error!!!", log_path, "doesn't exist..")
            sys.exit()

        try:
            tree = ET.parse(log_path)
        except Exception as e:
            print(f'[+] Oops..! Please make sure binary data is not present in the log, like raw image dumps, flash (.swf files) dumps, etc. Error: {e}')
            sys.exit()

        root = tree.getroot()

        for reqs in root.findall('item'):
            raw_req = reqs.find('request').text
            raw_resp = reqs.find('response').text

            # Check if raw request exists before parsing
            if raw_req is not None:
                raw_req = urllib.parse.unquote(raw_req).encode('utf8').decode()

            result[raw_req] = raw_resp

        return result

    def parse_raw_http(self, raw):
        '''
        Parses a raw HTTP request and splits it into method, path, headers, and body.
        '''
        if isinstance(raw, bytes):
            try:
                raw = raw.decode('utf8')
            except Exception as e:
                print(f"Decoding error: {e}")

        headers = {}
        body = ""
        
        # Split raw HTTP request into headers and body
        sp = raw.split('\r\n\r\n', 1)
        
        head = sp[0]
        if len(sp) > 1:
            body = sp[1]

        # Split headers
        lines = head.split('\r\n')
        
        # First line should contain the method and path
        request_line = lines[0].split(' ', 2)
        if len(request_line) >= 2:
            method = request_line[0]
            path = request_line[1]
        else:
            raise ValueError("Malformed request line")

        # Parse headers
        for line in lines[1:]:
            if ": " in line:
                header_name, header_value = line.split(': ', 1)
                headers[header_name] = header_value

        return method, path, headers, body


badwords = ['sleep', 'drop', 'uid', 'select', 'waitfor', 'delay', 'system', 'union', 'order by', 'group by']

# Function to extract features from a given request
def extract_features(method, path_enc, body_enc, headers):
    badwords_count = 0
    path = urllib.parse.unquote_plus(path_enc)
    body = urllib.parse.unquote(body_enc)
    
    single_q = path.count("'") + body.count("'")
    double_q = path.count('"') + body.count('"')
    dashes = path.count("--") + body.count("--")
    braces = path.count("{") + body.count("{")
    spaces = path.count(" ") + body.count(" ")

    # Count badwords in the request path and body
    for word in badwords:
        badwords_count += path.count(word) + body.count(word)

    # Count badwords and special characters in headers
    for header_value in headers.values():
        single_q += header_value.count("'")
        double_q += header_value.count('"')
        dashes += header_value.count("--")
        braces += header_value.count("{")
        spaces += header_value.count(" ")
        
        for word in badwords:
            badwords_count += header_value.count(word)

    return [
        method, 
        path_enc.encode('utf-8').strip(), 
        body_enc.encode('utf-8').strip(),
        single_q, double_q, dashes, braces, spaces, badwords_count
    ]


# Initialize CSV writer and write headers
with open(csv_path, "w", newline='') as f:
    c = csv.writer(f)
    c.writerow(["method", "path", "body", "single_q", "double_q", "dashes", "braces", "spaces", "badwords", "class"])

lp = LogParse()
result = lp.parse_log(log_path)

# Parse the log and write to the CSV file
with open(csv_path, "a", newline='') as f:
    c = csv.writer(f)

    for raw_req, raw_resp in result.items():
        try:
            raw = base64.b64decode(raw_req)  # Decode base64 raw request
            method, path, headers, body = lp.parse_raw_http(raw)
            extracted_features = extract_features(method, path, body, headers)
            c.writerow(extracted_features + [class_flag])
        except Exception as e:
            print(f"Error processing request: {e}")
