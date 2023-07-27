import crypto from 'crypto';

const SECRET = 'MIRCEA-LICENTA';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt:string, password:string) =>{
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
//creez un HMAC(hash-based message authentication code) obiect
//foloseste algoritmul sha256 si o cheie secreta formata din 
//"salt"/"password" si cheia secreta SECRET apoi o transforma in hex
