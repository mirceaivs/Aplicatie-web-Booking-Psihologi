"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpecializare = exports.getAllSpecializari = exports.deleteSpecializare = exports.getPoza = exports.getSpecializareDenumire = exports.getSpecializari = exports.getSpecializare = exports.verificareSpecializare = exports.adaugaSpecializare = void 0;
const init_models_1 = require("../models/init-models");
const adaugaSpecializare = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { denumire_specializare, nr_atestat } = req.body;
        if (!denumire_specializare || !nr_atestat) {
            return res.status(400).send({ error: "Campuri invalide!" });
        }
        let existingSpecializare = await user.getSpecializariByDenumire(denumire_specializare);
        if (existingSpecializare) {
            return res.status(400).json({ error: "Specializare existenta!" }).end();
        }
        existingSpecializare = await init_models_1.specializari.findOne({
            where: {
                nr_atestat: nr_atestat
            }
        });
        if (existingSpecializare) {
            return res.status(400).json({ error: "Specializare existenta!" }).end();
        }
        const poza_diplomas = req.file?.buffer;
        if (!poza_diplomas) {
            return res.status(400).json({ error: "Poza inexistenta!" }).end();
        }
        await init_models_1.specializari.create({
            denumire_specializare: denumire_specializare,
            nr_atestat: nr_atestat,
            poza_diploma: poza_diplomas,
            user_id: user.user_id
        });
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.adaugaSpecializare = adaugaSpecializare;
const verificareSpecializare = async (req, res) => {
    try {
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(id);
        if (!specializare) {
            return res.status(404).send({ error: "Specializare inexistenta!" });
        }
        specializare.verificat = 1;
        await specializare.save();
        return res.status(200).json(specializare);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.verificareSpecializare = verificareSpecializare;
const getSpecializare = async (req, res) => {
    try {
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(id);
        if (!specializare) {
            return res.status(404).send({ error: "Specializari inexistente!" });
        }
        return res.status(200).json(specializare);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getSpecializare = getSpecializare;
const getSpecializari = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.findByPk(id);
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const specializari = await user.getSpecializari();
        if (!specializari) {
            return res.status(404).send({ error: "Specializari inexistente!" });
        }
        return res.status(200).json(specializari);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getSpecializari = getSpecializari;
const getSpecializareDenumire = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { denumire } = req.params;
        const specializare = await user.getSpecializariByDenumire(denumire);
        if (!specializare) {
            return res.status(404).send({ error: "Specializare inexistenta!" });
        }
        return res.status(200).json(specializare);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getSpecializareDenumire = getSpecializareDenumire;
//modifica poza
//sterge poza
const getPoza = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(id);
        if (!specializare) {
            return res.status(404).send({ error: "Specializare inexistenta!" });
        }
        //TESTARE DE STERS
        // if(specializare.poza_diploma != undefined){
        //     const filePath = 'uploads/fisier.jpg';
        //     fs.writeFileSync(filePath, specializare.poza_diploma);
        // }
        res.set('Content-Type', 'image/jpeg, image/png, image/jpg');
        res.send(specializare.poza_diploma);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getPoza = getPoza;
const deleteSpecializare = async (req, res) => {
    try {
        const { id } = req.params;
        await init_models_1.users.deleteSpecializareById(parseInt(id));
        // await users.deleteSpecializareById(parseInt(id));
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteSpecializare = deleteSpecializare;
const getAllSpecializari = async (req, res) => {
    try {
        const specializariAll = await init_models_1.specializari.findAll({
            where: {
                verificat: 0
            }
        });
        return res.status(200).json(specializariAll);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllSpecializari = getAllSpecializari;
//de uitat pentru poza de modificat return 
const updateSpecializare = async (req, res) => {
    try {
        const { id } = req.params;
        const specializare = await init_models_1.specializari.findByPk(id);
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        if (!specializare) {
            return res.status(404).send({ error: "Nu exista specializare!" });
        }
        const keysToUpdate = ['denumire_specializare', 'poza', 'nr_atestat', 'verificat'];
        const fieldToUpdate = {};
        for (const key of keysToUpdate) {
            if (req.body[key] || (key == 'poza' && req.file)) {
                fieldToUpdate[key] = req.body[key] || req.file;
            }
        }
        if (Object.keys(fieldToUpdate).length == 0) {
            return res.status(400).send({ error: "Nu exista campuri valide" });
        }
        let existingSpecializare;
        for (const key in fieldToUpdate) {
            const value = fieldToUpdate[key];
            switch (key) {
                case 'denumire_specializare':
                    existingSpecializare = await init_models_1.specializari.findOne({
                        where: {
                            denumire_specializare: value,
                            user_id: user.user_id
                        }
                    });
                    if (existingSpecializare) {
                        return res.status(200).send({ error: "Specializarea cu acest nume exista deja!" });
                    }
                    specializare.denumire_specializare = value;
                    break;
                case 'poza':
                    const poza_diplomas = req.file?.buffer;
                    specializare.poza_diploma = poza_diplomas;
                    break;
                case 'nr_atestat':
                    existingSpecializare = await init_models_1.specializari.findOne({
                        where: {
                            nr_atestat: value,
                            user_id: user.user_id
                        }
                    });
                    if (existingSpecializare) {
                        return res.status(200).send({ error: "Specializarea cu acest nr de atestat exista deja!" });
                    }
                    specializare.nr_atestat = value;
                    break;
                case 'verificat':
                    specializare.verificat = value;
                    break;
                default:
                    break;
            }
        }
        await specializare.save();
        return res.status(200).json(specializare);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateSpecializare = updateSpecializare;
//# sourceMappingURL=specializari.js.map