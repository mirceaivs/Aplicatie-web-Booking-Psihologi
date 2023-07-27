import { Request, Response } from "express";
import { users } from "../models/init-models"
import { program_psihologi } from "../models/program_psihologi";
import { CustomRequest } from "../middlewares";

//folosesc set inloc de a adauga
export const adaugaProgram = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }

        const program: program_psihologi[] = req.body.map((programData: any) => {
            return {
                ziua_saptamanii: programData.ziua_saptamanii,
                ora_inceput: programData.ora_inceput,
                ora_sfarsit: programData.ora_sfarsit,
                user_id: user.user_id
            };
        });

        const hasMissingFields = program.some(prog => !prog.ziua_saptamanii || !prog.ora_inceput || !prog.ora_sfarsit);
        if (hasMissingFields) {
            return res.status(400).send({ error: "Nu exista campuri valide!" });
        }
        if (await user.countProgram_psihologis() == 0) {
            program.forEach(async (prog) => {
                await user.createProgram_psihologi(prog);
            });
        }
        else {
            await user.deleteProgramUser();
            program.forEach(async (prog) => {
                await user.createProgram_psihologi(prog);
            });
        }

        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const getProgramPsihologById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await users.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }
        const program_psiholog = await user.getProgram_psihologis();
        if (!program_psiholog) {
            return res.status(404).send({ error: "Nu exista programul psihologului!" });
        }


        return res.status(200).json(program_psiholog);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const deleteProgram = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await users.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }
        await program_psihologi.destroy({
            where: {
                user_id: user.user_id
            }
        })
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

