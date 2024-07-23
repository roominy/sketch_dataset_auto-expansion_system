import base64
import os
import hashlib
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

class AESCipher(object):

    def __init__(self, key):
        self.key = hashlib.sha256(key.encode()).digest()

    def encrypt(self, raw):
        raw = self._pad(raw)
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        return base64.b64encode(iv + cipher.encrypt(raw.encode()))

    def decrypt(self, enc):
        enc = base64.b64decode(enc)
        iv = enc[:AES.block_size]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        return self._unpad(cipher.decrypt(enc[AES.block_size:])).decode('utf-8')

    def _pad(self, s):
        return s + (AES.block_size - len(s) % AES.block_size) * chr(AES.block_size - len(s) % AES.block_size)

    @staticmethod
    def _unpad(s):
        return s[:-ord(s[len(s)-1:])]
    
def get_aes_key_from_rsa(rsa_file_path):
    expanded_path = os.path.expanduser(rsa_file_path)
    if not os.path.exists(expanded_path):
        raise FileNotFoundError(f"The file {expanded_path} does not exist.")
    with open(expanded_path, 'r') as file:
        lines = file.readlines()
        key_data = lines[1]  # Take the second line
    return key_data[:128]  # Extract the first 16 bytes

def get_salt_from_rsa(rsa_file_path):
    expanded_path = os.path.expanduser(rsa_file_path)
    if not os.path.exists(expanded_path):
        raise FileNotFoundError(f"The file {expanded_path} does not exist.")
    with open(expanded_path, 'r') as file:
        lines = file.readlines()
        key_data = lines[2]  # Take the second line
    return key_data[:128]  # Extract the first 16 bytes
