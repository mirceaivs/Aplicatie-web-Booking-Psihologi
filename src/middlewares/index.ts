import { NextFunction, Request, Response } from 'express';
import { merge } from 'lodash';
import { users } from '../models/users';


export interface CustomRequest extends Request {
    identity?: users;
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const sessionToken = await req.cookies['MIRCEA-AUTH'];
        console.log(sessionToken);
        if (!sessionToken) {
            return res.status(404).send({ error: "Nu exista sessionToken" });
        }
        const existingUser = await users.getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(404).send({ error: "Nu exista Userul" });
        }

        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'admin') {
            return res.sendStatus(403);
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isClient = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'client') {
            return res.sendStatus(403);
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isPsiholog = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'psiholog') {
            return res.sendStatus(403);
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

