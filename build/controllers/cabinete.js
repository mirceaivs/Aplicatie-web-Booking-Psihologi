"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCabinet = exports.deleteCabinet = exports.getCabinetbyByDenumire = exports.getCabinetById = exports.getCabinete = exports.adaugaCabinet = void 0;
const init_models_1 = require("../models/init-models");
//folosim middleware de psiolog
const adaugaCabinet = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        const { denumire_Cabinet, adresa, judet, localitate } = req.body;
        if (!denumire_Cabinet || !adresa || !judet) {
            return res.status(400).send({ error: "Campuri lipsa!" });
        }
        // const cabinets: cabinete[] = req.body.map((cabinetData: any) => {
        //     return {
        //         denumire_Cabinet: cabinetData.denumire,
        //         adresa: cabinetData.adresa,
        //         judet: cabinetData.judet,
        //         localitate: cabinetData.localitate,
        //         user_id: user.user_id
        //     };
        // });
        // const hasMissingFields = cabinets.some(cab => !cab.localitate || !cab.denumire_Cabinet || !cab.adresa);
        // if (hasMissingFields) {
        //     return res.status(400).send({ error: "Campuri lipsa!" });
        // }
        // let hasDuplicates = false;
        // if (await user.countCabinetes() != 0) {
        //     for (const cab of cabinets) {
        //         const cabs = await user.getCabineteByAdresa(cab.adresa);
        //         if (cabs) {
        //             hasDuplicates = true;
        //             break;
        //         }
        //     }
        // }
        // cabinets.forEach(async (cabinet) => {
        //     await user.createCabinete(cabinet);
        // });
        const hasDuplicates = await init_models_1.cabinete.findOne({
            where: {
                user_id: user.user_id,
                adresa: adresa,
                denumire_Cabinet: denumire_Cabinet
            }
        });
        if (hasDuplicates) {
            return res.status(400).send({ error: "Cabinetul este deja introdus" });
        }
        await init_models_1.cabinete.create({
            denumire_Cabinet: denumire_Cabinet,
            judet: judet,
            localitate: localitate,
            user_id: user.user_id,
            adresa: adresa
        });
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Server error" });
    }
};
exports.adaugaCabinet = adaugaCabinet;
const getCabinete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.findByPk(id);
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        const cabinetes = await user.getCabinetes();
        if (!cabinetes) {
            return res.status(404).send({ error: "Nu exista cabinete!" });
        }
        return res.status(200).json(cabinetes);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getCabinete = getCabinete;
const getCabinetById = async (req, res) => {
    try {
        const { id } = req.params;
        const cabinet = await init_models_1.cabinete.findByPk(id);
        if (!cabinet) {
            return res.status(404).send({ error: "Cabinet inexistent!" });
        }
        return res.status(200).json(cabinet);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getCabinetById = getCabinetById;
const getCabinetbyByDenumire = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        const { denumire } = req.params;
        const cabinet = await user.getCabinetByDenumire(denumire);
        if (!cabinet) {
            return res.status(404).send({ error: "Nu exista cabinet!" });
        }
        return res.status(200).json(cabinet);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getCabinetbyByDenumire = getCabinetbyByDenumire;
//sa vad cu user cum fac sa nu stearga de la toti 
const deleteCabinet = async (req, res) => {
    try {
        const { id } = req.params;
        const raspuns = await init_models_1.users.deleteCabinetById(parseInt(id));
        if (!raspuns) {
            return res.status(404).send({ error: "Nu s-a putut efectua stergerea!" });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteCabinet = deleteCabinet;
//
const updateCabinet = async (req, res) => {
    try {
        const { id } = req.params;
        const cabinet = await init_models_1.cabinete.findByPk(id);
        if (!cabinet) {
            return res.status(404).send({ error: "Nu exista cabinet de actualizat!" });
        }
        const keysToUpdate = ['denumire_Cabinet', 'judet', 'localitate', 'adresa'];
        const fieldToUpdate = {};
        for (const key of keysToUpdate) {
            if (req.body[key]) {
                fieldToUpdate[key] = req.body[key];
            }
        }
        if (Object.keys(fieldToUpdate).length == 0) {
            return res.status(400).send({ error: "Nu exista campuri valide!" });
        }
        for (const key in fieldToUpdate) {
            const value = fieldToUpdate[key];
            switch (key) {
                case 'denumire_Cabinet':
                    cabinet.denumire_Cabinet = value;
                    break;
                case 'judet':
                    cabinet.judet = value;
                    break;
                case 'localitate':
                    cabinet.localitate = value;
                    break;
                case 'adresa':
                    cabinet.adresa = value;
                    break;
                default:
                    break;
            }
        }
        await cabinet.save();
        return res.status(200).json(cabinet);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateCabinet = updateCabinet;
//# sourceMappingURL=cabinete.js.map