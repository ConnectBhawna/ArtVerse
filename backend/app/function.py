import jwt
from ecdsa import SECP256k1, VerifyingKey
import binascii
from base58 import b58decode_check


def validateJWT(jwtToken, publicKey):
    try:
        rawPublicKeyHex = b58decode_check(publicKey)[3:].hex()
        public_key = bytes(rawPublicKeyHex, 'utf-8')
        public_key = binascii.unhexlify(public_key)
        key = VerifyingKey.from_string(public_key, curve=SECP256k1)
        key = key.to_pem()
        decoded = jwt.decode(jwtToken, key, algorithms=['ES256'])
        return True
    except Exception as e:
        return False