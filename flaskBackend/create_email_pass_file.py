import getpass
from cipher import AESCipher, get_aes_key_from_rsa
import settings


def create_email_pass_file(password):
    aes_key = get_aes_key_from_rsa(settings.KEY_FILE_PATH)
    cipher = AESCipher(aes_key)
    encrypted = cipher.encrypt(password)
    with open(settings.EMAIL_PASSWORD_FILE_PATH, 'wb') as f:
        f.write(encrypted)
    print(f"Database password file created in {settings.EMAIL_PASSWORD_FILE_PATH}")

def read_email_pass_file():
    with open(settings.EMAIL_PASSWORD_FILE_PATH, 'rb') as f:
        encrypted = f.read()
    aes_key = get_aes_key_from_rsa(settings.KEY_FILE_PATH)
    cipher = AESCipher(aes_key)
    print("Database password: ", cipher.decrypt(encrypted))


if __name__ == "__main__":

    password = getpass.getpass(prompt='Email password: ', stream=None)
    if not password:
        print("Password cannot be empty")
        exit(1) 
    create_email_pass_file(password)
    read_email_pass_file()