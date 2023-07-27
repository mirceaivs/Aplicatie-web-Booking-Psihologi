"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgramare = exports.intervaleOrare = exports.deleteProgramare = exports.getProgramareById = exports.getServiciiProgPsiholog = exports.getProgramarePsiholog = exports.getProgramareClient = exports.adaugaProgramare = void 0;
const init_models_1 = require("../models/init-models");
const moment_1 = __importDefault(require("moment"));
const email_1 = require("./util/email");
//de facut verificatul ala 
//id psiholog se va lua din serviciile pe care le baga 
const adaugaProgramare = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { data_programare } = req.body;
        //lista de servicii -> serviciu id body
        const { serviciu_id } = req.body;
        const { id } = req.body;
        const idpsiholog = parseInt(id.replace(/"/g, ''));
        if (!serviciu_id) {
            return res.status(400).send({ error: "Nu exista servicii selectate!" });
        }
        if (!data_programare) {
            return res.status(400).send({ error: "Nu exista data programare selectata!" });
        }
        const programareExistenta = await user.getOneProgramareByData(data_programare, id);
        if (programareExistenta) {
            return res.status(400).send({ error: "Programare deja existenta" });
        }
        await user.adaugaProgramare(data_programare, serviciu_id);
        const psiholog = await init_models_1.users.findByPk(idpsiholog);
        if (!psiholog) {
            return res.status(404).send({ error: "Psiholog inexistent" });
        }
        const url = `http://localhost:5173/programaripsiholog`;
        (0, email_1.sendProgramareNoua)(psiholog.email, url);
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.adaugaProgramare = adaugaProgramare;
const getProgramareClient = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const programarileClientului = await init_models_1.programari.findAll({
            where: {
                user_id: user.user_id
            }
        });
        if (!programarileClientului) {
            return res.status(404).send({ error: "Programari client inexistente!" });
        }
        const currentDate = (0, moment_1.default)();
        const savePromises = programarileClientului.map(async (programare) => {
            if (programare) {
                const dataProgramare = (0, moment_1.default)(programare.data_programare);
                if (dataProgramare.isBefore(currentDate)) {
                    programare.aprobat = 3;
                    await programare.save();
                }
                const user = await init_models_1.users.findByPk(programare.user_id);
                return {
                    data_programare: programare.data_programare,
                    data_realizare: programare.data_realizare,
                    programare_id: programare.programare_id,
                    user_id: programare.user_id,
                    aprobat: programare.aprobat,
                    user_nume: user?.nume,
                    user_prenume: user?.prenume,
                    user_telefon: user?.nr_telefon
                };
            }
        });
        let listProgramari = await Promise.all(savePromises);
        let uniqueProgramari = listProgramari.filter((programare, index, self) => index === self.findIndex((p) => (p && p.programare_id === programare?.programare_id)));
        uniqueProgramari = uniqueProgramari.sort((a, b) => {
            const aMoment = (0, moment_1.default)(a?.data_programare);
            const bMoment = (0, moment_1.default)(b?.data_programare);
            return aMoment.isAfter(bMoment) ? -1 : 1;
        });
        return res.status(200).json(uniqueProgramari);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getProgramareClient = getProgramareClient;
const getProgramarePsiholog = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const programariservicii = await user.getProgramarePsiholog();
        if (!programariservicii) {
            return res.status(404).send({ error: "Programari psiholog inexistente!" });
        }
        const promises = programariservicii.map(async (progserv) => {
            return progserv.getProgramare();
        });
        let programariList = await Promise.all(promises);
        const currentDate = (0, moment_1.default)();
        const savePromises = programariList.map(async (programare) => {
            if (programare) {
                const dataProgramare = (0, moment_1.default)(programare.data_programare);
                if (dataProgramare.isBefore(currentDate)) {
                    programare.aprobat = 3;
                    await programare.save();
                }
                const user = await init_models_1.users.findByPk(programare.user_id);
                return {
                    data_programare: programare.data_programare,
                    data_realizare: programare.data_realizare,
                    programare_id: programare.programare_id,
                    user_id: programare.user_id,
                    aprobat: programare.aprobat,
                    user_nume: user?.nume,
                    user_prenume: user?.prenume,
                    user_telefon: user?.nr_telefon
                };
            }
        });
        // Actualizăm lista de programări cu rezultatul promisiunilor
        let listProgramari = await Promise.all(savePromises);
        let uniqueProgramari = listProgramari.filter((programare, index, self) => index === self.findIndex((p) => (p && p.programare_id === programare?.programare_id)));
        uniqueProgramari = uniqueProgramari.sort((a, b) => {
            const aMoment = (0, moment_1.default)(a?.data_programare);
            const bMoment = (0, moment_1.default)(b?.data_programare);
            return aMoment.isAfter(bMoment) ? -1 : 1;
        });
        return res.status(200).json(uniqueProgramari).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getProgramarePsiholog = getProgramarePsiholog;
const getServiciiProgPsiholog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({ error: "Programare inexistenta" });
        }
        //unde progserv programare_id
        const serviciiProgramare = await init_models_1.servicii.findAll({
            include: [
                {
                    model: init_models_1.programari_servicii,
                    as: 'programari_serviciis',
                    where: { programare_id: id },
                },
            ],
        });
        return res.status(200).json(serviciiProgramare).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getServiciiProgPsiholog = getServiciiProgPsiholog;
const getProgramareById = async (req, res) => {
    try {
        const { id } = req.params;
        const programare = await init_models_1.users.getProgramareById(parseInt(id));
        if (!programare) {
            return res.status(404).send({ error: "Nu exista programarea" });
        }
        return res.status(200).json(programare).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getProgramareById = getProgramareById;
const deleteProgramare = async (req, res) => {
    try {
        const { id } = req.params;
        await init_models_1.users.deleteProgramareById(parseInt(id));
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteProgramare = deleteProgramare;
const intervaleOrare = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("A INTRAT");
        const { data_programare, serviciu_id } = req.body;
        if (!id || !data_programare || !serviciu_id) {
            return res.status(400).send({ error: "Campuri invalide!" });
        }
        const intervale = await init_models_1.users.intervaleProgramare(data_programare, parseInt(id), serviciu_id);
        if (!intervale) {
            return res.status(404).send({ error: "Nu exista intervale disponibile in aceasta zi!" });
        }
        return res.status(200).json(intervale).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.intervaleOrare = intervaleOrare;
//aici inloc de adauga o sa folosesc cea de update si o sa fac la fel cu intervale orare
// export const updateProgramare = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const programare = await programari.findByPk(id);
//         if (!programare) {
//             return res.status(404).send({ error: "Programare inexistenta!" });
//         }
//         const { data_programare } = req.body;
//         if (!data_programare) {
//             return res.status(400).send({ error: "Camp invalid!" });
//         }
//         if (moment(new Date(data_programare)).isBefore(moment()))
//             return res.status(400).send({ error: "Data nu poate fi mai mica decat data curenta!" });
//         const data_realizare = new Date(format(new Date(), 'yyyy-MM-dd HH:mm'));
//         programare.data_programare = data_programare;
//         programare.data_realizare = data_realizare;
//         const keysToUpdate = ['data_programare', 'aprobat'];
//         const fieldToUpdate: { [key: string]: any } = {};
//         for (const key of keysToUpdate) {
//             if (req.body[key]) {
//                 fieldToUpdate[key] = req.body[key];
//             }
//         }
//         if (Object.keys(fieldToUpdate).length == 0) {
//             return res.status(400).send({ error: "Nu exsita campuri valide!" });
//         }
//         for (const key in fieldToUpdate) {
//             const value = fieldToUpdate[key];
//             switch (key) {
//                 case 'data_programare':
//                     programare.data_programare = value;
//                     programare.data_realizare = data_realizare;
//                     break;
//                 case 'aprobat':
//                     programare.aprobat = value;
//                     programare.data_realizare = data_realizare;
//                     break;
//                 default:
//                     break;
//             }
//         }
//         await programare.save();
//         //de testat daca intra bine in baza de date
//         //aprobat daca merge 
//         return res.status(200).json(programare);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }
const updateProgramare = async (req, res) => {
    try {
        const { id } = req.params;
        const programare = await init_models_1.programari.findByPk(id);
        if (!programare) {
            return res.status(404).send({ error: "Programare inexistenta!" });
        }
        const psiholog = req.identity;
        if (!psiholog) {
            return res.status(404).send({ error: 'Psiholog inexistent!' });
        }
        const client = await init_models_1.users.findByPk(programare.user_id);
        if (!client) {
            return res.status(404).send({ error: 'Client inexistent!' });
        }
        const numeprenume = psiholog.nume + " " + psiholog.prenume;
        (0, email_1.sendConfirmareProgramare)(client.email, numeprenume);
        programare.aprobat = 1;
        await programare.save();
        //de testat daca intra bine in baza de date
        //aprobat daca merge
        return res.status(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateProgramare = updateProgramare;
//# sourceMappingURL=programari.js.map