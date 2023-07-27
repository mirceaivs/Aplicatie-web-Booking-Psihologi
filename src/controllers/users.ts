import { Request, Response } from "express";
import { cabinete, servicii, specializari, users } from "../models/init-models";
import { random, authentication } from "./util/auth_helpers";
import fs from 'fs';
import { CustomRequest } from "../middlewares";
import { Op } from 'sequelize';


export const SearchEngine = async (req: Request, res: Response) => {
    try {

        interface UserId {
            user_id: number;
        }
        const { q } = req.query;
        console.log(q);
        const { localitate, judet } = req.body;
        const includeOptions = [];

        if (localitate && judet) {
            includeOptions.push({
                model: cabinete,
                as: "cabinetes",
                where: {
                    [Op.or]: [
                        { localitate: { [Op.like]: `%${localitate}%` } },
                        { judet: { [Op.like]: `%${judet}%` } }
                    ]
                }
            });
        } else if (localitate) {
            includeOptions.push({
                model: cabinete,
                as: "cabinetes",
                where: {
                    localitate: { [Op.like]: `%${localitate}%` }
                }
            });
        } else if (judet) {
            includeOptions.push({
                model: cabinete,
                as: "cabinetes",
                where: {
                    judet: { [Op.like]: `%${judet}%` }
                }
            });
        }
        console.log(includeOptions);


        // search by nume or prenume first
        let usersByNumeOrPrenume: UserId[] = await users.findAll({
            attributes: ['user_id'],
            where: {
                [Op.or]: [
                    { nume: { [Op.like]: `%${q}%` } },
                    { prenume: { [Op.like]: `%${q}%` } }
                ],
                user_type: 'psiholog',
                verificat: 1
            }
        });

        if (usersByNumeOrPrenume.length === 0) {
            console.log('de aici');
            let [usersByDenumireSpecializare, usersByDenumireServiciu]: [UserId[], UserId[]] = await Promise.all([
                users.findAll({
                    attributes: ['user_id'],
                    include: [{
                        model: specializari,
                        as: 'specializaris',
                        where: { denumire_specializare: { [Op.like]: `${q}%` } }
                    }],
                    where: {
                        user_type: 'psiholog',
                        verificat: 1
                    }
                }),
                servicii.findAll({
                    attributes: ['user_id'],
                    where: {
                        denumire: { [Op.like]: `${q}%` }
                    }
                })
            ]);
            let [usersLocalitate, usersJudet]: [UserId[], UserId[]] = await Promise.all([
                users.findAll({
                    attributes: ['user_id'],
                    include: [{
                        model: cabinete,
                        as: 'cabinetes',
                        where: {
                            localitate: { [Op.like]: `%${localitate}%` }
                        }
                    }],
                    where: {
                        user_type: 'psiholog',
                        verificat: 1
                    }
                }),
                users.findAll({
                    attributes: ['user_id'],
                    include: [{
                        model: cabinete,
                        as: 'cabinetes',
                        where: {
                            judet: { [Op.like]: `%${judet}%` }
                        }
                    }],
                    where: {
                        user_type: 'psiholog',
                        verificat: 1
                    }
                }),
            ]);

            console.log(usersLocalitate, usersJudet);

            usersByNumeOrPrenume = [...usersLocalitate, ...usersJudet, ...usersByDenumireServiciu, ...usersByDenumireSpecializare];
        }

        const userIds = usersByNumeOrPrenume.map(user => user.user_id);


        const rezultateCautare = await users.findAll({
            attributes: {
                include: ['user_id', 'nume', 'prenume', 'poza'],
                exclude: ['salt', 'user_password', 'sessionToken', 'verificat', 'email', 'user_type', 'nr_telefon']
            },
            where: {
                user_id: {
                    [Op.in]: userIds
                }
            },
            include: includeOptions
        });



        return res.status(200).send(rezultateCautare);

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await users.getUsers();
        return res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send({ error: 'Server error' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        res.clearCookie('MIRCEA-AUTH');
        await users.deleteUserById(parseInt(id));
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: 'User inexistent' });
    }
}

export const deleteUserAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await users.deleteUserById(parseInt(id));
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: 'User inexistent' });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await users.getUserById(parseInt(id));
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
}

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const user = await users.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Nu exista user!' });
        }
        return res.json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}

export const getPozaUser = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await users.getUserById(parseInt(id));
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
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}

export const getUserByCookie = async (req: CustomRequest, res: Response) => {
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
        };
        return res.status(200).json({ logged: true, user: campuriUser });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}


export const updateUser = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }

        const keysToUpdate = ['user_password', 'email', 'user_name', 'nr_telefon', 'nume', 'prenume', 'poza'];
        const fieldToUpdate: { [key: string]: any } = {};

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
                    const noua_parola = authentication(user.salt, value);
                    if (user.user_password == noua_parola) {
                        return res.status(400).send({ error: "Nu poti pune aceeasi parola!" });
                    }
                    const salt = random();
                    user.user_password = authentication(salt, value);
                    user.salt = salt;
                    break;
                case 'email':
                    existingUser = await users.findOne({
                        where: {
                            email: value
                        }
                    })
                    if (existingUser) {
                        return res.status(200).send({ error: "Emailul este deja folosit!" })
                    }
                    user.email = value;
                    break;
                case 'user_name':
                    existingUser = await users.findOne({
                        where: {
                            user_name: value
                        }
                    })
                    if (existingUser) {
                        return res.status(200).send({ error: "Username ul este deja folosit!" })
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

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}

//SA NU FIE ACEEASI PAROLA DRACU 
export const updateParola = async (req: Request, res: Response) => {
    try {
        const user_id = req.cookies['user'];
        if (!user_id) {
            return res.status(500).send({ error: "Server error" });
        }

        const { user_password } = req.body;

        const user = await users.findByPk(user_id);
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }

        const noua_parola = authentication(user.salt, user_password);
        if (user.user_password == noua_parola) {
            return res.status(400).send({ error: "Nu poti pune aceeasi parola!" });
        }
        res.clearCookie('user', { httpOnly: true });

        const salt = random();
        user.user_password = authentication(salt, user_password);
        user.salt = salt;
        await user.save();

        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Server error' });
    }
}
