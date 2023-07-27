import { Request, Response } from "express";
import { cabinete, users } from "../models/init-models";
import { CustomRequest } from "../middlewares";
//folosim middleware de psiolog
export const adaugaCabinet = async (req: CustomRequest, res: Response) => {
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
        const hasDuplicates = await cabinete.findOne({
            where: {
                user_id: user.user_id,
                adresa: adresa,
                denumire_Cabinet: denumire_Cabinet
            }
        })


        if (hasDuplicates) {
            return res.status(400).send({ error: "Cabinetul este deja introdus" });
        }
        await cabinete.create({
            denumire_Cabinet: denumire_Cabinet,
            judet: judet,
            localitate: localitate,
            user_id: user.user_id,
            adresa: adresa
        })



        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Server error" });
    }
}

export const getCabinete = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        const cabinetes = await user.getCabinetes();
        if (!cabinetes) {
            return res.status(404).send({ error: "Nu exista cabinete!" });
        }


        return res.status(200).json(cabinetes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getCabinetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cabinet = await cabinete.findByPk(id);
        if (!cabinet) {
            return res.status(404).send({ error: "Cabinet inexistent!" });
        }



        return res.status(200).json(cabinet);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const getCabinetbyByDenumire = async (req: CustomRequest, res: Response) => {
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
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

//sa vad cu user cum fac sa nu stearga de la toti 
export const deleteCabinet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const raspuns = await users.deleteCabinetById(parseInt(id));
        if (!raspuns) {
            return res.status(404).send({ error: "Nu s-a putut efectua stergerea!" });
        }
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

//
export const updateCabinet = async (req: CustomRequest, res: Response) => {
    try {

        const { id } = req.params;

        const cabinet = await cabinete.findByPk(id);
        if (!cabinet) {
            return res.status(404).send({ error: "Nu exista cabinet de actualizat!" });
        }
        const keysToUpdate = ['denumire_Cabinet', 'judet', 'localitate', 'adresa'];
        const fieldToUpdate: {
            [key: string]: any
        } = {};
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

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

