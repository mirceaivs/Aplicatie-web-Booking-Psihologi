import { Request, Response } from "express";
import { users, programari, servicii, programari_servicii } from "../models/init-models";
import moment from 'moment';
import { format } from 'date-fns';
import { CustomRequest } from "../middlewares";
import { GoogleCalendar, sendConfirmareProgramare, sendProgramareNoua } from "./util/email";

//de facut verificatul ala 
//id psiholog se va lua din serviciile pe care le baga 

export const googleCalendar = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const programare = await programari.findByPk(parseInt(id));
        if (!programare) {
            return res.status(404).send({ error: "Nu exista programarea!" });
        }
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { nume } = req.body;
        await GoogleCalendar(programare, user.email, nume);
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const adaugaProgramare = async (req: CustomRequest, res: Response) => {
    try {

        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const { data_programare } = req.body;
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
        const psiholog = await users.findByPk(idpsiholog);
        if (!psiholog) {
            return res.status(404).send({ error: "Psiholog inexistent" });
        }
        const url = `http://localhost:5173/programaripsiholog`;
        sendProgramareNoua(psiholog.email, url);
        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getProgramareClient = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const programarileClientului = await programari.findAll({
            where: {
                user_id: user.user_id
            }
        });
        if (!programarileClientului) {
            return res.status(404).send({ error: "Programari client inexistente!" });
        }
        const currentDate = moment();
        const savePromises = programarileClientului.map(async (programare) => {
            if (programare) {
                const dataProgramare = moment(programare.data_programare);

                if (dataProgramare.isBefore(currentDate)) {
                    programare.aprobat = 3;
                    await programare.save();
                }
                const prog_servicu = await programari_servicii.findOne({
                    where: {
                        programare_id: programare.programare_id
                    }
                })
                const serviciu = await servicii.findOne({
                    where: {
                        seriviciu_id: prog_servicu?.seriviciu_id
                    }
                })
                const user = await users.findByPk(serviciu?.user_id);

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
        let listProgramari: ({ data_programare: Date, programare_id: number, user_id?: number, aprobat?: number, user_nume?: string, user_prenume?: string } | undefined)[] = await Promise.all(savePromises);

        let uniqueProgramari = listProgramari.filter((programare, index, self) =>
            index === self.findIndex((p) => (p && p.programare_id === programare?.programare_id))
        );

        uniqueProgramari = uniqueProgramari.sort((a, b) => {
            const aMoment = moment(a?.data_programare);
            const bMoment = moment(b?.data_programare);

            return aMoment.isAfter(bMoment) ? -1 : 1;
        });

        return res.status(200).json(uniqueProgramari);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getProgramarePsiholog = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "Nu exista user!" });
        }
        const programariservicii = await user.getProgramarePsiholog();
        if (!programariservicii) {
            return res.status(404).send({ error: "Programari psiholog inexistente!" });
        }

        const promises = programariservicii.map(async (progserv: programari_servicii) => {
            return progserv.getProgramare();
        });

        let programariList = await Promise.all(promises);

        const currentDate = moment();
        const savePromises = programariList.map(async (programare) => {
            if (programare) {
                const dataProgramare = moment(programare.data_programare);
                if (dataProgramare.isBefore(currentDate)) {
                    programare.aprobat = 3;
                    await programare.save();
                }
                const user = await users.findByPk(programare.user_id);

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
        let listProgramari: ({ data_programare: Date, programare_id: number, user_id?: number, aprobat?: number, user_nume?: string, user_prenume?: string } | undefined)[] = await Promise.all(savePromises);
        let uniqueProgramari = listProgramari.filter((programare, index, self) =>
            index === self.findIndex((p) => (p && p.programare_id === programare?.programare_id))
        );

        uniqueProgramari = uniqueProgramari.sort((a, b) => {
            const aMoment = moment(a?.data_programare);
            const bMoment = moment(b?.data_programare);

            return aMoment.isAfter(bMoment) ? -1 : 1;
        });

        return res.status(200).json(uniqueProgramari).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const getServiciiProgPsiholog = async (req: CustomRequest, res: Response) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(404).send({ error: "Programare inexistenta" });
        }

        //unde progserv programare_id
        const serviciiProgramare = await servicii.findAll({
            include: [
                {
                    model: programari_servicii,
                    as: 'programari_serviciis',
                    where: { programare_id: id },
                },
            ],
        });



        return res.status(200).json(serviciiProgramare).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getProgramareById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const programare = await users.getProgramareById(parseInt(id));
        if (!programare) {
            return res.status(404).send({ error: "Nu exista programarea" });
        }
        return res.status(200).json(programare).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const deleteProgramare = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await users.deleteProgramareById(parseInt(id));
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const intervaleOrare = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data_programare, serviciu_id } = req.body;
        if (!id || !data_programare || !serviciu_id) {
            return res.status(400).send({ error: "Campuri invalide!" });
        }

        const intervale = await users.intervaleProgramare(data_programare, parseInt(id), serviciu_id);
        if (!intervale) {
            return res.status(404).send({ error: "Nu exista intervale disponibile in aceasta zi!" });
        }
        return res.status(200).json(intervale).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

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

export const updateProgramare = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const programare = await programari.findByPk(id);
        if (!programare) {
            return res.status(404).send({ error: "Programare inexistenta!" });
        }

        const psiholog = req.identity;
        if (!psiholog) {
            return res.status(404).send({ error: 'Psiholog inexistent!' });
        }
        const client = await users.findByPk(programare.user_id);
        if (!client) {
            return res.status(404).send({ error: 'Client inexistent!' });
        }
        const numeprenume = psiholog.nume + " " + psiholog.prenume;
        sendConfirmareProgramare(client.email, numeprenume);
        programare.aprobat = 1;

        await programare.save();
        //de testat daca intra bine in baza de date
        //aprobat daca merge
        return res.status(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}