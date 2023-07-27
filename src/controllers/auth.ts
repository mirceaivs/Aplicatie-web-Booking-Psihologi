import { Request, Response } from 'express';
import { users } from '../models/users';
import { random, authentication } from './util/auth_helpers';
import { sendVerificareEmail } from './util/email';
import jwt, { JwtPayload } from 'jsonwebtoken';




// Definiția conținutului tokenului
const secretKey = 'MIRCEA-AUTH'; // Cheia secretă utilizată pentru semnarea tokenului
const options = { expiresIn: '24h' }; // Opțiuni pentru token (ex. expirare)


export const createUser = async (req: Request, res: Response) => {
    try {
        const { user_password, user_name, nume, prenume, user_type, email, nr_telefon } = req.body;

        if (!email || !user_password || !user_name) {
            return res.status(400).send({ error: "Campuri lipsa!" });
        }
        let existingUser = await users.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send({ error: "Emailul deja exista in baza de date!" });
        }
        existingUser = await users.findOne({
            where: {
                user_name: user_name
            }
        });
        if (existingUser) {
            return res.status(400).send({ error: "Userul cu numele acesta exista in baza de date!" });
        }
        const poza = req.file?.buffer;
        const salt = random();
        const user = await users.create({
            salt,
            user_password: authentication(salt, user_password),
            user_name: user_name,
            nume: nume,
            prenume: prenume,
            user_type: user_type,
            email: email,
            nr_telefon: nr_telefon,
            poza: poza
        });

        const payload: JwtPayload = { user_id: user.user_id };
        const token = jwt.sign(payload, secretKey, options);
        const urlEncoded = encodeURIComponent(token);
        const url = `http://localhost:3000/api/user/verificare/${urlEncoded}`;

        sendVerificareEmail(user.email, url);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}


export const verificaToken = async (req: Request, res: Response) => {
    try {
        const tokenFromURL = req.params.token;
        const token = decodeURIComponent(tokenFromURL);
        const decodat = jwt.verify(token, secretKey) as { user_id: number };
        const user_id = decodat.user_id;
        const user = await users.findByPk(user_id);

        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        user.verificat = 1;
        await user.save();
        return res.redirect('http://localhost:5173/login');
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}


export const recuperareParola = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await users.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).send({ error: "Email inexistent!" });
        }

        const payload: JwtPayload = { email: email };
        const token = jwt.sign(payload, secretKey, options);
        const urlEncoded = encodeURIComponent(token);
        const url = `http://localhost:3000/api/user/recuperareparola/${urlEncoded}`;
        sendVerificareEmail(email, url);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Email inexistent!" });
    }
}

export const verificaTokenRecParola = async (req: Request, res: Response) => {
    try {
        const tokenFromURL = req.params.token;
        const token = decodeURIComponent(tokenFromURL);
        const decodat = jwt.verify(token, secretKey) as { email: string };
        const email = decodat.email;
        const user = await users.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        res.cookie('user', user.user_id, { httpOnly: true, maxAge: 300000 });
        return res.redirect('http://localhost:5173/schimbareparola');
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, user_password } = req.body;
        if (!email || !user_password) {
            return res.status(400).send({ error: "Campuri lipsa!" });
        }
        const user = await users.findOne({
            where: { email: email }
        });
        if (!user) {
            return res.status(404).send({ error: "Date invalide!" }).end();
        }

        if (user.verificat == 0) {
            return res.status(404).send({ error: "User neverificat!" });
        }
        const expectedHash = authentication(user.salt, user_password);
        if (user.user_password != expectedHash) {
            return res.status(400).send({ error: "Date Invalide!" }).end();
        }
        const salt = random();
        user.sessionToken = authentication(salt, user.user_id.toString());
        await user.save();
        const expirationDate = new Date('2099-12-31');
        res.cookie('MIRCEA-AUTH', user.sessionToken,
            { domain: 'localhost', path: '/', expires: expirationDate, httpOnly: true });
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
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: "Date Invalide!" }).end();
    }
}

export const logout = async (req: Request, res: Response) => {
    try {

        const sessionToken = req.cookies['MIRCEA-AUTH'];
        res.clearCookie('MIRCEA-AUTH');
        const user = await users.getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        user.sessionToken = null as null;
        await user.save();


        //stopCuratareSessionToken();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}