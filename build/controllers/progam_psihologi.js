"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgram = exports.getProgramPsihologById = exports.adaugaProgram = void 0;
const init_models_1 = require("../models/init-models");
const program_psihologi_1 = require("../models/program_psihologi");
//folosesc set inloc de a adauga
const adaugaProgram = async (req, res) => {
    try {
        const user = req.identity;
        if (!user) {
            return res.status(404).send({ error: "User inexistent!" });
        }
        const program = req.body.map((programData) => {
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
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.adaugaProgram = adaugaProgram;
const getProgramPsihologById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }
        const program_psiholog = await user.getProgram_psihologis();
        if (!program_psiholog) {
            return res.status(404).send({ error: "Nu exista programul psihologului!" });
        }
        return res.status(200).json(program_psiholog);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getProgramPsihologById = getProgramPsihologById;
const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await init_models_1.users.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }
        await program_psihologi_1.program_psihologi.destroy({
            where: {
                user_id: user.user_id
            }
        });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteProgram = deleteProgram;
//# sourceMappingURL=progam_psihologi.js.map