"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.verificaTokenRecParola = exports.recuperareParola = exports.verificaToken = exports.createUser = void 0;
const users_1 = require("../models/users");
const auth_helpers_1 = require("./util/auth_helpers");
const email_1 = require("./util/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Definiția conținutului tokenului
const secretKey = 'MIRCEA-AUTH'; // Cheia secretă utilizată pentru semnarea tokenului
const options = { expiresIn: '24h' }; // Opțiuni pentru token (ex. expirare)
const createUser = async (req, res) => {
    try {
        const { user_password, user_name, nume, prenume, user_type, email, nr_telefon } = req.body;
        if (!email || !user_password || !user_name) {
            return res.status(400).send({ error: "Campuri lipsa!" });
        }
        let existingUser = await users_1.users.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send({ error: "Emailul deja exista in baza de date!" });
        }
        existingUser = await users_1.users.findOne({
            where: {
                user_name: user_name
            }
        });
        if (existingUser) {
            return res.status(400).send({ error: "Userul cu numele acesta exista in baza de date!" });
        }
        const poza = req.file?.buffer;
        const salt = (0, auth_helpers_1.random)();
        const user = await users_1.users.create({
            salt,
            user_password: (0, auth_helpers_1.authentication)(salt, user_password),
            user_name: user_name,
            nume: nume,
            prenume: prenume,
            user_type: user_type,
            email: email,
            nr_telefon: nr_telefon,
            poza: poza
        });
        const payload = { user_id: user.user_id };
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        const urlEncoded = encodeURIComponent(token);
        const url = `http://localhost:3000/api/user/verificare/${urlEncoded}`;
        (0, email_1.sendVerificareEmail)(user.email, url);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
exports.createUser = createUser;
const verificaToken = async (req, res) => {
    try {
        const tokenFromURL = req.params.token;
        const token = decodeURIComponent(tokenFromURL);
        const decodat = jsonwebtoken_1.default.verify(token, secretKey);
        const user_id = decodat.user_id;
        const user = await users_1.users.findByPk(user_id);
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        user.verificat = 1;
        await user.save();
        return res.redirect('http://localhost:5173/login');
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
exports.verificaToken = verificaToken;
const recuperareParola = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await users_1.users.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).send({ error: "Email inexistent!" });
        }
        const payload = { email: email };
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        const urlEncoded = encodeURIComponent(token);
        const url = `http://localhost:3000/api/user/recuperareparola/${urlEncoded}`;
        (0, email_1.sendVerificareEmail)(email, url);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Email inexistent!" });
    }
};
exports.recuperareParola = recuperareParola;
const verificaTokenRecParola = async (req, res) => {
    try {
        const tokenFromURL = req.params.token;
        const token = decodeURIComponent(tokenFromURL);
        const decodat = jsonwebtoken_1.default.verify(token, secretKey);
        const email = decodat.email;
        const user = await users_1.users.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        res.cookie('user', user.user_id, { httpOnly: true, maxAge: 300000 });
        return res.redirect('http://localhost:5173/schimbareparola');
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
exports.verificaTokenRecParola = verificaTokenRecParola;
const login = async (req, res) => {
    try {
        const { email, user_password } = req.body;
        if (!email || !user_password) {
            return res.status(400).send({ error: "Campuri lipsa!" });
        }
        const user = await users_1.users.findOne({
            where: { email: email }
        });
        if (!user) {
            return res.status(404).send({ error: "Date invalide!" }).end();
        }
        if (user.verificat == 0) {
            return res.status(404).send({ error: "User neverificat!" });
        }
        const expectedHash = (0, auth_helpers_1.authentication)(user.salt, user_password);
        if (user.user_password != expectedHash) {
            return res.status(400).send({ error: "Date Invalide!" }).end();
        }
        const salt = (0, auth_helpers_1.random)();
        user.sessionToken = (0, auth_helpers_1.authentication)(salt, user.user_id.toString());
        await user.save();
        const expirationDate = new Date('2099-12-31');
        //secure doar daca am https true cand pot de testat httponly
        res.cookie('MIRCEA-AUTH', user.sessionToken, { domain: 'localhost', path: '/', expires: expirationDate, httpOnly: true });
        const campuriUser = {
            user_name: user.user_name,
            user_id: user.user_id,
            nume: user.nume,
            prenume: user.prenume,
            email: user.email,
            user_type: user.user_type,
            nr_telefon: user.nr_telefon,
        };
        return res.status(200).json({ logged: true, user: campuriUser });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Date Invalide!" }).end();
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies['MIRCEA-AUTH'];
        res.clearCookie('MIRCEA-AUTH');
        const user = await users_1.users.getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        user.sessionToken = null;
        await user.save();
        //stopCuratareSessionToken();
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map