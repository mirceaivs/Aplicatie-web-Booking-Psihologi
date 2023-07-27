"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiciu = exports.deleteServiciu = exports.getAllVerificatServicii = exports.getServiciiByDenumire = exports.getServiciiSpecializari = exports.getServicii = exports.getServiciuById = exports.adaugaServiciu = void 0;
const init_models_1 = require("../models/init-models");
const adaugaServiciu = async (req, res) => {
    try {
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(parseInt(id));
        if (!specializare) {
            return res.status(404).send({ erorr: "Nu exsita specialiare" });
        }
        console.log("A INTRAT");
        const { denumire, pret, durata, descriere } = req.body;
        if (!denumire || !pret || !durata) {
            return res.status(400).send({ error: "Campuri invalide!" });
        }
        const existingServiciu = await init_models_1.servicii.findOne({
            where: {
                denumire: denumire,
                specializare_id: specializare.specializare_id
            }
        });
        if (existingServiciu) {
            return res.status(400).json({ error: "Specializare existenta!" }).end();
        }
        //dau create 
        await init_models_1.servicii.create({
            denumire: denumire,
            pret: pret,
            durata: durata,
            descriere: descriere,
            specializare_id: specializare.specializare_id,
            user_id: specializare.user_id
        });
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.adaugaServiciu = adaugaServiciu;
const getServiciuById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviciu = await init_models_1.users.getServiciuById(parseInt(id));
        if (!serviciu) {
            return res.status(404).send({ error: "Serviciu inexistent!" });
        }
        return res.status(200).json(serviciu).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getServiciuById = getServiciuById;
const getServicii = async (req, res) => {
    try {
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(id);
        if (!specializare) {
            return res.status(404).send({ error: "Nu exista specializare!" });
        }
        const servici = await init_models_1.servicii.findAll({
            where: {
                specializare_id: specializare?.specializare_id
            }
        });
        if (!servici) {
            return res.status(404).send({ error: "Servicii inexistente!" });
        }
        return res.status(200).json(servici);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getServicii = getServicii;
const getServiciiSpecializari = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const serviciiSiSpecializari = await user.getListaSpecializariServicii();
        if (!serviciiSiSpecializari) {
            return res.status(404).send({ error: "Servicii inexistente!" });
        }
        return res.status(200).json(serviciiSiSpecializari);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getServiciiSpecializari = getServiciiSpecializari;
const getServiciiByDenumire = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { denumire } = req.params;
        const serviciu = await user.getServiciiByDenumire(denumire);
        if (!serviciu) {
            return res.status(404).send({ error: "Servicii inexistente!" });
        }
        return res.status(200).json(serviciu);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getServiciiByDenumire = getServiciiByDenumire;
const getAllVerificatServicii = async (req, res) => {
    try {
        const { id } = req.params;
        // const psiholog = await users.findByPk(id);
        // if (!psiholog) {
        //     return res.status(404).send({ error: "Nu exista psiholog!" });
        // }
        const servici = await init_models_1.servicii.findAll({
            where: {
                user_id: id,
            },
            include: [
                {
                    model: init_models_1.specializari,
                    as: 'specializare',
                    attributes: [],
                    where: {
                        verificat: 1,
                    },
                },
            ],
        });
        if (!servici) {
            return res.status(404).send({ error: "Servicii inexistente!" });
        }
        return res.status(200).json(servici);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllVerificatServicii = getAllVerificatServicii;
const deleteServiciu = async (req, res) => {
    try {
        const { id } = req.params;
        await init_models_1.users.deleteServiciuById(parseInt(id));
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteServiciu = deleteServiciu;
const updateServiciu = async (req, res) => {
    try {
        const { id } = req.params;
        const serviciu = await init_models_1.servicii.findByPk(id);
        if (!serviciu) {
            return res.status(404).send({ error: "Serviciu inexistent!" });
        }
        const keysToUpdate = ['denumire', 'pret', 'descriere', 'durata'];
        const fieldToUpdate = {};
        for (const key of keysToUpdate) {
            if (req.body[key]) {
                fieldToUpdate[key] = req.body[key];
            }
        }
        if (Object.keys(fieldToUpdate).length == 0) {
            return res.status(400).send({ error: "Nu exista campuri valide" });
        }
        for (const key in fieldToUpdate) {
            const value = fieldToUpdate[key];
            switch (key) {
                case 'denumire':
                    const existingServiciu = await init_models_1.servicii.findOne({
                        where: {
                            denumire: value,
                            specializare_id: serviciu.specializare_id
                        }
                    });
                    if (existingServiciu) {
                        return res.status(400).json({ error: "Denumirea specializarii exista deja!" }).end();
                    }
                    serviciu.denumire = value;
                    break;
                case 'pret':
                    serviciu.pret = value;
                    break;
                case 'durata':
                    serviciu.durata = value;
                    break;
                case 'descriere':
                    serviciu.descriere = value;
                    break;
                default:
                    break;
            }
        }
        await serviciu.save();
        return res.status(200).json(serviciu);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateServiciu = updateServiciu;
//# sourceMappingURL=servicii.js.map