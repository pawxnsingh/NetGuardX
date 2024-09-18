from redis import Redis

class PolicyEnforcer:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)

    def check_policy(self, packet):
        # Extract relevant information from the packet
        src_ip = packet["IP"].src
        dst_ip = packet["IP"].dst
        dst_port = packet["TCP"].dport if "TCP" in packet else packet["UDP"].dport
            
        # Check against policies in Redis
        policy_key = f"{src_ip}:{dst_ip}:{dst_port}"
        policy = self.redis_client.get(policy_key)

        if policy == b"ALLOW":
            return True
        elif policy == b"BLOCK":
            return False
        else:
            # Default policy if not found
            return True  # or False, depending on your default stance

policy_enforcer = PolicyEnforcer()