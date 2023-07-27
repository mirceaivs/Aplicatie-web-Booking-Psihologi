"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPsiholog = exports.isClient = exports.isAdmin = exports.isAuthenticated = void 0;
const lodash_1 = require("lodash");
const users_1 = require("../models/users");
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = await req.cookies['MIRCEA-AUTH'];
        console.log(sessionToken);
        if (!sessionToken) {
            return res.status(404).send({ error: "Nu exista sessionToken" });
        }
        const existingUser = await users_1.users.getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.status(404).send({ error: "Nu exista Userul" });
        }
        (0, lodash_1.merge)(req, { identity: existingUser });
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = async (req, res, next) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'admin') {
            return res.sendStatus(403);
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isAdmin = isAdmin;
const isClient = async (req, res, next) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'client') {
            return res.sendStatus(403);
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isClient = isClient;
const isPsiholog = async (req, res, next) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.sendStatus(400);
        }
        else if (user.user_type != 'psiholog') {
            return res.sendStatus(403);
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isPsiholog = isPsiholog;
//# sourceMappingURL=index.js.map