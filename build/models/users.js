"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
const cabinete_1 = require("./cabinete");
const servicii_1 = require("./servicii");
const specializari_1 = require("./specializari");
const programari_1 = require("./programari");
const programari_servicii_1 = require("./programari_servicii");
const program_psihologi_1 = require("./program_psihologi");
const date_fns_1 = require("date-fns");
const db_1 = require("./db");
const moment_1 = __importDefault(require("moment"));
class users extends sequelize_1.Model {
    //functii-cabinet
    async getCabineteByAdresa(adresa) {
        const cabinete = await this.getCabinetes();
        const cabinetGasit = cabinete.find(cabinet => cabinet.adresa === adresa);
        return cabinetGasit;
    }
    async getCabinetByDenumire(denumire) {
        const cabinete = await this.getCabinetes();
        const cabinetGasit = cabinete.find(cabinet => cabinet.denumire_Cabinet == denumire);
        return cabinetGasit;
    }
    static async deleteCabinetById(id) {
        try {
            const deletedCabinet = await cabinete_1.cabinete.findByPk(id);
            await deletedCabinet?.destroy();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteProgramUser() {
        try {
            await program_psihologi_1.program_psihologi.destroy({
                where: {
                    user_id: this.user_id
                }
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    //sa fac chestia sa accepte programarea sau nu 
    //verificarea 0 neacceptat 1 acceptat 2 modificat 3 finalizata
    async adaugaProgramare(data_programare, listaServicii) {
        try {
            const data_realizare = new Date((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm'));
            const parsedArray = JSON.parse(listaServicii);
            const programare = await programari_1.programari.create({
                data_programare: data_programare,
                data_realizare: data_realizare,
                user_id: this.user_id
            });
            for (const serv of parsedArray) {
                programari_servicii_1.programari_servicii.create({
                    programare_id: programare.programare_id,
                    seriviciu_id: serv
                });
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    static async getProgramareById(programare_id) {
        const programare = await programari_1.programari.findByPk(programare_id);
        return programare;
    }
    static async deleteProgramareById(programareId) {
        try {
            const programare = await programari_1.programari.findByPk(programareId);
            if (!programare) {
                return false;
            }
            const programare_servicii = await programari_servicii_1.programari_servicii.findOne({
                where: {
                    programare_id: programare.programare_id
                }
            });
            await programare_servicii?.destroy();
            await programare.destroy();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    //detaliat prog-servicii DE MODIFICAT
    //iau progrmari servicii 
    async getProgramareClient() {
        try {
            const programare = await this.getProgramaris();
            if (!programare) {
                return undefined;
            }
            const listaIdServicii = [];
            for (const prog of programare) {
                listaIdServicii.push(await programari_servicii_1.programari_servicii.findAll({
                    where: {
                        programare_id: prog.programare_id,
                    }
                }));
            }
            return listaIdServicii;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    async getProgramarePsiholog() {
        try {
            const servicii = await this.getListaServiciiPsiholog();
            if (!servicii) {
                return undefined;
            }
            const programari_psiholog = [];
            for (const serv of servicii) {
                const programare = await programari_servicii_1.programari_servicii.findAll({
                    where: {
                        seriviciu_id: serv.seriviciu_id
                    }
                });
                if (programare) {
                    programari_psiholog.push(...programare);
                }
            }
            return programari_psiholog;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    //delete si get programare totala cu servicii cu d alea cu id psiholog id client
    //mai trebuie inca o funcite sa ia toate programarile unui user 
    //trebuie sa dau check ora la care se face programarea sa nu interfereze
    //   static async getOraSiDataProgramare(data_prog:any){
    //     const data = new Date(data_prog);
    //     const ora_programare = data.toISOString().substring(12, 16);
    //     const data_programare = data.toISOString().substring(0, 10);
    //     return {ora_programare, data_programare};
    // }
    static async calculezTimpProgramare(programare) {
        let total_minute = 0;
        const programare_servicii = await programari_servicii_1.programari_servicii.findAll({
            where: { programare_id: programare.programare_id }
        });
        for (let i = 0; i < programare_servicii.length; i++) {
            const servici = await servicii_1.servicii.findByPk(programare_servicii[i].seriviciu_id);
            if (!servici) {
                continue;
            }
            const durata = servici.durata + 10;
            total_minute = durata + total_minute;
        }
        return total_minute;
    }
    static async calculezTimpServicii(listaServicii) {
        let total_minute = 0;
        for (let i = 0; i < listaServicii.length; i++) {
            const servici = await servicii_1.servicii.findByPk(listaServicii[i]);
            if (!servici) {
                continue;
            }
            const durata = servici.durata + 10;
            total_minute = durata + total_minute;
        }
        return total_minute;
    }
    //da check orelor returneaza true daca se poate pune programarea
    //trebuie  sa mai fac ora sa o convertesc in minute adaug minutele din total si fac o noua ora
    //ar trebui sa iau data curenta atunci cand e apelata functia de fapt ca sa ii ofer intervale orare cred?!
    //daca clientul refuza modificarea se sterge programarea
    //calcul timp serviciu programare
    // async calculezTimpTotalServiciiIntoZi(data_prog:Date){ 
    //   try{
    //     const result = await users.getOraSiDataProgramare(data_prog);
    //     if(result){
    //       const {ora_programare}= result;
    //     }
    //     const programare_datacurenta = await this.getProgramareByData(data_prog);
    //     if(!programare_datacurenta){
    //       return true;
    //     }
    //     const timpTotalServicii = async ()=> {
    //       let total_minute = 0;
    //       for(let i=0; i<programare_datacurenta.length; i++){
    //         const programare_servicii = await programari_servicii.findAll({
    //           where:{ programare_id : programare_datacurenta[i].programare_id}
    //         });
    //         for(let j = 0; j< programare_servicii.length; j++){
    //           const servici = await servicii.findByPk(programare_servicii[j].seriviciu_id);
    //           if(!servici){
    //             continue;  
    //           }
    //           const durata = servici.durata + 15;
    //           total_minute = durata+total_minute;
    //         }
    //     }
    //     return total_minute;
    //     };
    //     const rezultat = await timpTotalServicii();
    //     return rezultat;
    //   }catch(error){
    //     console.log(error);
    //     return false;
    //   }
    // }
    static adaugMinuteInOra(timp_initial, minute) {
        const date = new Date(timp_initial);
        date.setMinutes(date.getMinutes() + minute);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    //el trimite o lista de servicii data in care ar vrea sa se programeze si la ce psiholog
    //start_ora si top_ora sa le ia din program psiholog
    //this = client
    //program si sa mearga asta cu programul unui psiholog
    //isauthenticated cu ispsiholog is client is admin sa vad 
    static async intervaleProgramare(data_programare, psiholog_id, listaServicii) {
        try {
            let start_ora;
            let stop_ora;
            const data_curenta = (0, moment_1.default)().format('yyyy-MM-DD');
            const parsedArray = JSON.parse(listaServicii);
            const psiholog = await users.findByPk(psiholog_id);
            if (!psiholog) {
                return undefined;
            }
            //ar trebui sa iau data cand da click si sa vad daca este o zi muncitoare a lui 
            const program_psiholog = await psiholog.getProgram_psihologis();
            const data = new Date(data_programare);
            const ziua_saptamaniiProgramare = (0, moment_1.default)(data).weekday();
            let terminat = false;
            for (const prog of program_psiholog) {
                let nr_zi;
                switch (prog.ziua_saptamanii) {
                    case 'Sunday':
                        nr_zi = 0;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Monday':
                        nr_zi = 1;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Tuesday':
                        nr_zi = 2;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Wednesday':
                        nr_zi = 3;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Thursday':
                        nr_zi = 4;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Friday':
                        nr_zi = 5;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                    case 'Saturday':
                        nr_zi = 6;
                        start_ora = prog.ora_inceput;
                        stop_ora = prog.ora_sfarsit;
                        break;
                }
                if (ziua_saptamaniiProgramare == nr_zi) {
                    terminat = true;
                    break;
                }
            }
            if (!terminat) {
                return false;
            }
            //compar datele intre ele ca si string
            const bookedProgramare = [];
            const availableProgramare = [];
            // daca e in aceeasi zi
            if (data_curenta == data_programare) {
                const programari_psiholog_datacurenta = await psiholog.getProgramariPsihologiByData(data_programare);
                if (!programari_psiholog_datacurenta) {
                    return undefined;
                }
                for (let i = 0; i < programari_psiholog_datacurenta.length; i++) {
                    if (!programari_psiholog_datacurenta[i].data_programare) {
                        return undefined;
                    }
                    const ora_programare = programari_psiholog_datacurenta[i]?.data_programare.toString();
                    const durataProgramare = await users.calculezTimpProgramare(programari_psiholog_datacurenta[i]);
                    const ora_programare_finala = users.adaugMinuteInOra(ora_programare, durataProgramare);
                    bookedProgramare.push({ start: ora_programare.substring(11, 16), sfarsit: ora_programare_finala });
                }
                console.log(bookedProgramare);
                const durataServicii = await users.calculezTimpServicii(parsedArray);
                console.log('Durata', durataServicii);
                let oraCurenta = (0, moment_1.default)().startOf('hour').add(1, 'hour').format('HH:mm');
                let oraCurentaInterval = (0, moment_1.default)(oraCurenta, 'HH:mm');
                const start_oraInterval = (0, moment_1.default)(start_ora, 'HH:mm');
                const stop_oraInterval = (0, moment_1.default)(stop_ora, 'HH:mm');
                if (oraCurentaInterval.isSameOrBefore(start_oraInterval)) {
                    oraCurentaInterval = start_oraInterval;
                }
                let aux;
                while (oraCurentaInterval.isBefore(stop_oraInterval)) {
                    const oraProgramareSfarsit = users.adaugMinuteInOra(oraCurentaInterval.toString(), durataServicii);
                    const oraProgramareSfarsitInterval = (0, moment_1.default)(oraProgramareSfarsit, 'HH:mm');
                    const prog = {
                        start: oraCurentaInterval,
                        sfarsit: oraProgramareSfarsitInterval
                    };
                    const esteOcupat = bookedProgramare.some(interval => {
                        const startInterval = (0, moment_1.default)(interval.start, 'HH:mm');
                        const sfarsitInterval = (0, moment_1.default)(interval.sfarsit, 'HH:mm');
                        aux = sfarsitInterval;
                        return ((prog.start.isBefore(sfarsitInterval) && prog.sfarsit.isAfter(startInterval)) ||
                            (prog.sfarsit.isAfter(startInterval) && prog.sfarsit.isBefore(sfarsitInterval)));
                        //PRIMA:14:00 - 15:40 => 14:00 < 15:40 && 15:40 > 14:00 true -> se incadreaza in interval
                        //A DOUA:daca sfarsitul e inaintea startInterval si daca sfarsitul este dupa sfarsit interval
                    });
                    if (!esteOcupat) {
                        availableProgramare.push(oraCurentaInterval.format('HH:mm'));
                    }
                    else {
                        oraCurentaInterval = aux;
                        continue;
                    }
                    if (oraCurentaInterval.minutes() != 0) {
                        oraCurentaInterval = (0, moment_1.default)(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60 - aux.minutes()), 'HH:mm');
                    }
                    else {
                        oraCurentaInterval = (0, moment_1.default)(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60), 'HH:mm');
                    }
                }
                return { availableProgramare };
            }
            else {
                const programari_psiholog_datacurenta = await psiholog.getProgramariPsihologiByData(data_programare);
                if (!programari_psiholog_datacurenta) {
                    return undefined;
                }
                for (let i = 0; i < programari_psiholog_datacurenta.length; i++) {
                    if (!programari_psiholog_datacurenta[i].data_programare) {
                        return undefined;
                    }
                    const ora_programare = programari_psiholog_datacurenta[i]?.data_programare.toString();
                    const durataProgramare = await users.calculezTimpProgramare(programari_psiholog_datacurenta[i]);
                    const ora_programare_finala = users.adaugMinuteInOra(ora_programare, durataProgramare);
                    bookedProgramare.push({ start: ora_programare.substring(11, 16), sfarsit: ora_programare_finala });
                }
                const durataServicii = await users.calculezTimpServicii(parsedArray);
                let oraCurenta = start_ora;
                let oraCurentaInterval = (0, moment_1.default)(oraCurenta, 'HH:mm');
                const stop_oraInterval = (0, moment_1.default)(stop_ora, 'HH:mm');
                let aux;
                while (oraCurentaInterval.isBefore(stop_oraInterval)) {
                    const oraProgramareSfarsit = users.adaugMinuteInOra(oraCurentaInterval.toString(), durataServicii);
                    const oraProgramareSfarsitInterval = (0, moment_1.default)(oraProgramareSfarsit, 'HH:mm');
                    const prog = {
                        start: oraCurentaInterval,
                        sfarsit: oraProgramareSfarsitInterval
                    };
                    const esteOcupat = bookedProgramare.some(interval => {
                        const startInterval = (0, moment_1.default)(interval.start, 'HH:mm');
                        const sfarsitInterval = (0, moment_1.default)(interval.sfarsit, 'HH:mm');
                        aux = sfarsitInterval;
                        return ((prog.start.isBefore(sfarsitInterval) && prog.sfarsit.isAfter(startInterval)) ||
                            (prog.sfarsit.isAfter(startInterval) && prog.sfarsit.isBefore(sfarsitInterval)));
                        //PRIMA:14:00 - 15:40 => 14:00 < 15:40 && 15:40 > 14:00 true -> se incadreaza in interval
                        //A DOUA:daca sfarsitul e inaintea startInterval si daca sfarsitul este dupa sfarsit interval
                    });
                    if (!esteOcupat) {
                        availableProgramare.push(oraCurentaInterval.format('HH:mm'));
                    }
                    else {
                        oraCurentaInterval = aux;
                        continue;
                    }
                    if (oraCurentaInterval.minutes() != 0) {
                        oraCurentaInterval = (0, moment_1.default)(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60 - aux.minutes()), 'HH:mm');
                    }
                    else {
                        oraCurentaInterval = (0, moment_1.default)(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60), 'HH:mm');
                    }
                }
                return { availableProgramare };
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    //de testat
    async getProgramariPsihologiByData(data_prog) {
        try {
            //lista cu programarile lui
            // const psiholog =  await users.findByPk(psiholog_id);
            // if(!psiholog){
            //   return undefined;
            // }
            const programari_servici = await this.getProgramarePsiholog();
            if (!programari_servici) {
                return undefined;
            }
            let data_programare;
            if (data_prog.length > 10) {
                const data = new Date(data_prog);
                data_programare = data.toISOString().substring(0, 10);
            }
            else {
                data_programare = data_prog;
            }
            const programari_pshiolog = [];
            const vector_frecventa = [];
            for (const prog_serv of programari_servici) {
                if (vector_frecventa.includes(prog_serv.programare_id)) {
                    continue;
                }
                const rezultat = await programari_1.programari.findOne({
                    where: {
                        programare_id: prog_serv.programare_id,
                        [Sequelize.Op.and]: [
                            db_1.sequelize.where(db_1.sequelize.fn('DATE', db_1.sequelize.col('data_programare')), data_programare)
                        ]
                    }
                });
                if (rezultat) {
                    programari_pshiolog.push(rezultat);
                    vector_frecventa.push(prog_serv.programare_id);
                }
            }
            return programari_pshiolog;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    async getProgramareByData(data_prog) {
        try {
            const data = new Date(data_prog);
            const data_programare = data.toISOString().substring(0, 10);
            const programareExistenta = await programari_1.programari.findAll({
                where: {
                    user_id: this.user_id,
                    [Sequelize.Op.and]: [
                        db_1.sequelize.where(db_1.sequelize.fn('DATE', db_1.sequelize.col('data_programare')), data_programare)
                    ]
                }
            });
            return programareExistenta;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    //poti sa ti fac o programare pe zi atat intr o zi poti avea doar o programare/cont
    async getOneProgramareByData(data_prog, id) {
        try {
            const data = new Date(data_prog);
            const data_programare = data.toISOString().substring(0, 10);
            const programareExistenta = await programari_1.programari.findOne({
                where: {
                    user_id: this.user_id,
                    [Sequelize.Op.and]: [
                        db_1.sequelize.where(db_1.sequelize.fn('DATE', db_1.sequelize.col('data_programare')), data_programare)
                    ]
                }
            });
            // const programareExistentaLaPsiholog = await servicii.findOne({
            //   where: { user_id: id }
            // })
            return programareExistenta;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    //SERVICII DE ACTUALIZAT
    static async deleteServiciuById(id) {
        try {
            const deletedServiciu = await servicii_1.servicii.findByPk(id);
            await deletedServiciu?.destroy();
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async getListaSpecializariServicii() {
        const specializari = await this.getSpecializari();
        const serviciiPromises = specializari.map((specializare) => {
            return servicii_1.servicii.findAll({
                where: {
                    specializare_id: specializare.specializare_id
                }
            }).then(serviciiArray => ({ specializare, servicii: serviciiArray }));
        });
        let serviciiSiSpecializari = await Promise.all(serviciiPromises);
        if (serviciiSiSpecializari.length === 0) {
            return null;
        }
        return serviciiSiSpecializari;
    }
    async getListaServiciiPsiholog() {
        const specializari = await this.getSpecializari();
        let listaServicii;
        const serviciiPromises = specializari.map((specializare) => {
            return servicii_1.servicii.findAll({
                where: {
                    specializare_id: specializare.specializare_id
                }
            });
        });
        let serviciiUser = await Promise.all(serviciiPromises);
        listaServicii = serviciiUser.flat();
        if (listaServicii.length === 0) {
            return null;
        }
        return listaServicii;
    }
    async getServiciiByDenumire(denumire) {
        const serviciuGasit = await servicii_1.servicii.findOne({
            where: {
                denumire: denumire,
                user_id: this.user_id
            }
        });
        return serviciuGasit;
    }
    static async getServiciuById(id) {
        const serviciu = await servicii_1.servicii.findByPk(id);
        return serviciu;
    }
    static async deleteSpecializareById(id) {
        try {
            const deletedSpecializare = await specializari_1.specializari.findByPk(id);
            await servicii_1.servicii.destroy({
                where: {
                    specializare_id: deletedSpecializare?.specializare_id
                }
            });
            await deletedSpecializare?.destroy();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async getSpecializari() {
        const specializaris = await specializari_1.specializari.findAll({
            where: {
                user_id: this.user_id
            },
            attributes: { exclude: ['poza_diploma'] }
        });
        return specializaris;
    }
    async getSpecializariByDenumire(denumire) {
        const specializareGasita = await specializari_1.specializari.findOne({
            where: {
                denumire_specializare: denumire,
                user_id: this.user_id
            },
            attributes: { exclude: ['poza_diploma'] }
        });
        return specializareGasita;
    }
    static async getUserByEmail(email) {
        const user = await users.findOne({
            where: { email: email },
        });
        return user;
    }
    static async getUserById(id) {
        const user = await users.findOne({
            where: { user_id: id },
        });
        return user;
    }
    static async getUserBySessionToken(sessionToken) {
        const user = await users.findOne({
            where: { sessionToken: sessionToken },
        });
        return user;
    }
    static async getUsers() {
        const allUsers = await users.findAll();
        return allUsers;
    }
    static async deleteUserById(id) {
        try {
            const deleteUser = await users.getUserById(id);
            await servicii_1.servicii.destroy({
                where: {
                    user_id: deleteUser?.user_id
                }
            });
            await programari_1.programari.destroy({
                where: {
                    user_id: deleteUser?.user_id
                }
            });
            await specializari_1.specializari.destroy({
                where: {
                    user_id: deleteUser?.user_id
                }
            });
            await cabinete_1.cabinete.destroy({
                where: {
                    user_id: deleteUser?.user_id
                }
            });
            //delete pentru toate tabelele
            await deleteUser?.destroy();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    static initModel(sequelize) {
        return users.init({
            user_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            user_name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                unique: "user_name_UNIQUE"
            },
            email: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                unique: "email_UNIQUE"
            },
            user_type: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            nume: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            prenume: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            sessionToken: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            user_password: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            salt: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            nr_telefon: {
                type: sequelize_1.DataTypes.STRING(25),
                allowNull: false
            },
            poza: {
                type: sequelize_1.DataTypes.BLOB('medium'),
                allowNull: true
            },
            verificat: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'users',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
                {
                    name: "email_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "email" },
                    ]
                },
                {
                    name: "user_name_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "user_name" },
                    ]
                },
            ]
        });
    }
}
exports.users = users;
//# sourceMappingURL=users.js.map