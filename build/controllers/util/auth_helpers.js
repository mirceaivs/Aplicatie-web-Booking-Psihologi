"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.random = void 0;
const crypto_1 = __importDefault(require("crypto"));
const SECRET = 'MIRCEA-LICENTA';
const random = () => crypto_1.default.randomBytes(128).toString('base64');
exports.random = random;
const authentication = (salt, password) => {
    return crypto_1.default.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
exports.authentication = authentication;
//creez un HMAC(hash-based message authentication code) obiect
//foloseste algoritmul sha256 si o cheie secreta formata din 
//"salt"/"password" si cheia secreta SECRET apoi o transforma in hex
//# sourceMappingURL=auth_helpers.js.map