"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParola = exports.updateUser = exports.getUserByCookie = exports.getPozaUser = exports.getUserByEmail = exports.getUserById = exports.deleteUser = exports.getAllUsers = exports.SearchEngine = void 0;
const init_models_1 = require("../models/init-models");
const auth_helpers_1 = require("./util/auth_helpers");
const sequelize_1 = require("sequelize");
const SearchEngine = async (req, res) => {
    try {
        const { q } = req.query;
        console.log(q);
        const { localitate, judet } = req.body;
        const includeOptions = [];
        if (localitate && judet) {
            includeOptions.push({
                model: init_models_1.cabinete,
                as: "cabinetes",
                where: {
                    [sequelize_1.Op.or]: [
                        { localitate: { [sequelize_1.Op.like]: `%${localitate}%` } },
                        { judet: { [sequelize_1.Op.like]: `%${judet}%` } }
                    ]
                }
            });
        }
        else if (localitate) {
            includeOptions.push({
                model: init_models_1.cabinete,
                as: "cabinetes",
                where: {
                    localitate: { [sequelize_1.Op.like]: `%${localitate}%` }
                }
            });
        }
        else if (judet) {
            includeOptions.push({
                model: init_models_1.cabinete,
                as: "cabinetes",
                where: {
                    judet: { [sequelize_1.Op.like]: `%${judet}%` }
                }
            });
        }
        console.log(includeOptions);
        // search by nume or prenume first
        let usersByNumeOrPrenume = await init_models_1.users.findAll({
            attributes: ['user_id'],
            where: {
                [sequelize_1.Op.or]: [
                    { nume: { [sequelize_1.Op.like]: `%${q}%` } },
                    { prenume: { [sequelize_1.Op.like]: `%${q}%` } }
                ],
                user_type: 'psiholog',
                verificat: 1
            }
        });
        if (usersByNumeOrPrenume.length === 0) {
            console.log('de aici');
            let [usersByDenumireSpecializare, usersByDenumireServiciu] = await Promise.all([
                init_models_1.users.findAll({
                    attributes: ['user_id'],
                    include: [{
                            model: init_models_1.specializari,
                            as: 'specializaris',
                            where: { denumire_specializare: { [sequelize_1.Op.like]: `${q}%` } }
                        }],
                    where: {
                        user_type: 'psiholog',
                        verificat: 1
                    }
                }),
                init_models_1.servicii.findAll({
                    attributes: ['user_id'],
                    where: {
                        denumire: { [sequelize_1.Op.like]: `${q}%` }
                    }
                })
            ]);
            usersByNumeOrPrenume = [...usersByDenumireSpecializare, ...usersByDenumireServiciu];
        }
        const userIds = usersByNumeOrPrenume.map(user => user.user_id);
        const rezultateCautare = await init_models_1.users.findAll({
            attributes: {
                include: ['user_id', 'nume', 'prenume', 'poza'],
                exclude: ['salt', 'user_password', 'sessionToken', 'verificat', 'email', 'user_type', 'nr_telefon']
            },
            where: {
                user_id: {
                    [sequelize_1.Op.in]: userIds
                }
            },
            include: includeOptions
        });
        return res.status(200).send(rezultateCautare);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.SearchEngine = SearchEngine;
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await init_models_1.users.getUsers();
        return res.status(200).json(allUsers);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500).send({ error: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        res.clearCookie('MIRCEA-AUTH');
        await init_models_1.users.deleteUserById(parseInt(id));
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(404).send({ error: 'User inexistent' });
    }
};
exports.deleteUser = deleteUser;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.getUserById(parseInt(id));
        if (!user) {
            return res.status(404).json({ error: 'Nu exista user!' });
        }
        const campuriUser = {
            user_name: user.user_name,
            user_id: user.user_id,
            nume: user.nume,
            prenume: user.prenume,
            email: user.email,
            user_type: user.user_type,
            nr_telefon: user.nr_telefon,
        };
        return res.status(200).json(campuriUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.getUserById = getUserById;
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await init_models_1.users.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Nu exista user!' });
        }
        return res.json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.getUserByEmail = getUserByEmail;
const getPozaUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.getUserById(parseInt(id));
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        if (!user.poza) {
            return res.status(400);
        }
        // TESTARE DE STERS
        // if (user.poza != undefined) {
        //     const filePath = 'uploads/fisier.jpg';
        //     fs.writeFileSync(filePath, user.poza);
        // }
        res.set('Content-Type', 'image/jpg');
        res.send(user.poza);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.getPozaUser = getPozaUser;
const getUserByCookie = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ logged: false });
        }
        const campuriUser = {
            user_name: user.user_name,
            user_id: user.user_id,
            nume: user.nume,
            prenume: user.prenume,
            email: user.email,
            user_type: user.user_type,
            nr_telefon: user.nr_telefon,
            // poza:user?.poza
        };
        return res.status(200).json({ logged: true, user: campuriUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.getUserByCookie = getUserByCookie;
const updateUser = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const keysToUpdate = ['user_password', 'email', 'user_name', 'nr_telefon', 'nume', 'prenume', 'poza'];
        const fieldToUpdate = {};
        for (const key of keysToUpdate) {
            if (req.body[key] || (key == 'poza' && req.file)) {
                fieldToUpdate[key] = req.body[key] || req.file;
            }
        }
        if (Object.keys(fieldToUpdate).length == 0) {
            return res.status(400).send({ error: "Nu exsita campuri valide!" });
        }
        let existingUser;
        for (const key in fieldToUpdate) {
            const value = fieldToUpdate[key];
            switch (key) {
                case 'user_password':
                    const noua_parola = (0, auth_helpers_1.authentication)(user.salt, value);
                    if (user.user_password == noua_parola) {
                        return res.status(400).send({ error: "Nu poti pune aceeasi parola!" });
                    }
                    const salt = (0, auth_helpers_1.random)();
                    user.user_password = (0, auth_helpers_1.authentication)(salt, value);
                    user.salt = salt;
                    break;
                case 'email':
                    existingUser = await init_models_1.users.findOne({
                        where: {
                            email: value
                        }
                    });
                    if (existingUser) {
                        return res.status(200).send({ error: "Emailul este deja folosit!" });
                    }
                    user.email = value;
                    break;
                case 'user_name':
                    existingUser = await init_models_1.users.findOne({
                        where: {
                            user_name: value
                        }
                    });
                    if (existingUser) {
                        return res.status(200).send({ error: "Username ul este deja folosit!" });
                    }
                    user.user_name = value;
                    break;
                case 'nume':
                    user.nume = value;
                    break;
                case 'prenume':
                    user.prenume = value;
                    break;
                case 'nr_telefon':
                    user.nr_telefon = value;
                    break;
                case 'poza':
                    const poza = req.file?.buffer;
                    user.poza = poza;
                    break;
                default:
                    break;
            }
        }
        await user.save();
        const campuriUser = {
            user_name: user.user_name,
            user_id: user.user_id,
            nume: user.nume,
            prenume: user.prenume,
            email: user.email,
            user_type: user.user_type,
            nr_telefon: user.nr_telefon,
        };
        return res.status(200).json(campuriUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.updateUser = updateUser;
//SA NU FIE ACEEASI PAROLA DRACU 
const updateParola = async (req, res) => {
    try {
        const user_id = req.cookies['user'];
        if (!user_id) {
            return res.status(500).send({ error: "Server error" });
        }
        const { user_password } = req.body;
        const user = await init_models_1.users.findByPk(user_id);
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const noua_parola = (0, auth_helpers_1.authentication)(user.salt, user_password);
        if (user.user_password == noua_parola) {
            return res.status(400).send({ error: "Nu poti pune aceeasi parola!" });
        }
        res.clearCookie('user', { httpOnly: true });
        const salt = (0, auth_helpers_1.random)();
        user.user_password = (0, auth_helpers_1.authentication)(salt, user_password);
        user.salt = salt;
        await user.save();
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
};
exports.updateParola = updateParola;
//# sourceMappingURL=users.js.map