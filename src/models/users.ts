import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { cabinete, cabineteId } from './cabinete';
import type { programariId } from './programari';
import type { ratings, ratingsId } from './ratings';
import type { reviews, reviewsId } from './reviews';
import { servicii } from './servicii';
import { specializari, specializariId } from './specializari';
import type { subscriptions, subscriptionsId } from './subscriptions';
import { programari } from './programari';
import { programari_servicii } from './programari_servicii';
import { program_psihologi, program_psihologiId } from './program_psihologi';
import { format } from 'date-fns';
import { sequelize } from './db';
import moment from 'moment';
import { String } from 'lodash';

export interface usersAttributes {
  user_id: number;
  user_name: string;
  email: string;
  user_type: string;
  nume: string;
  prenume: string;
  sessionToken?: string | null;
  user_password: string;
  salt: string;
  nr_telefon: string;
  poza?: Buffer;
  verificat: number;
}

export type usersPk = "user_id";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "user_id" | "sessionToken" | "poza" | "verificat";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  user_id!: number;
  user_name!: string;
  email!: string;
  user_type!: string;
  nume!: string;
  prenume!: string;
  sessionToken?: string | null;
  user_password!: string;
  salt!: string;
  nr_telefon!: string;
  poza?: any;
  verificat!: number;

  static async getUserByEmail(email: string) {
    const user = await users.findOne({
      where: { email: email },
    });
    return user;
  }

  static async getUserById(id: number) {
    const user = await users.findOne({
      where: { user_id: id },
    });
    return user;
  }

  static async getUserBySessionToken(sessionToken: string) {
    const user = await users.findOne({
      where: { sessionToken: sessionToken },
    });
    return user;
  }

  static async getUsers() {
    const allUsers = await users.findAll({
      where: {
        verificat: 0
      }
    });
    return allUsers;
  }

  static async deleteUserById(id: number) {
    try {
      const deleteUser = await users.getUserById(id);
      await servicii.destroy({
        where: {
          user_id: deleteUser?.user_id
        }
      })
      await programari.destroy({
        where: {
          user_id: deleteUser?.user_id
        }
      })
      await specializari.destroy({
        where: {
          user_id: deleteUser?.user_id
        }
      })
      await cabinete.destroy({
        where: {
          user_id: deleteUser?.user_id
        }
      })


      //delete pentru toate tabelele

      await deleteUser?.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  cabinetes!: cabinete[];
  getCabinetes!: Sequelize.HasManyGetAssociationsMixin<cabinete>;
  setCabinetes!: Sequelize.HasManySetAssociationsMixin<cabinete, cabineteId>;
  addCabinete!: Sequelize.HasManyAddAssociationMixin<cabinete, cabineteId>;
  addCabinetes!: Sequelize.HasManyAddAssociationsMixin<cabinete, cabineteId>;
  createCabinete!: Sequelize.HasManyCreateAssociationMixin<cabinete>;
  removeCabinete!: Sequelize.HasManyRemoveAssociationMixin<cabinete, cabineteId>;
  removeCabinetes!: Sequelize.HasManyRemoveAssociationsMixin<cabinete, cabineteId>;
  hasCabinete!: Sequelize.HasManyHasAssociationMixin<cabinete, cabineteId>;
  hasCabinetes!: Sequelize.HasManyHasAssociationsMixin<cabinete, cabineteId>;
  countCabinetes!: Sequelize.HasManyCountAssociationsMixin;

  async getCabineteByAdresa(adresa: string) {
    const cabinete = await this.getCabinetes();
    const cabinetGasit = cabinete.find(cabinet => cabinet.adresa === adresa)
    return cabinetGasit;
  }

  async getCabinetByDenumire(denumire: string) {
    const cabinete = await this.getCabinetes();
    const cabinetGasit = cabinete.find(cabinet => cabinet.denumire_Cabinet == denumire);
    return cabinetGasit;
  }

  static async deleteCabinetById(id: number) {
    try {
      const deletedCabinet = await cabinete.findByPk(id);
      await deletedCabinet?.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  // users hasMany program_psihologi via user_id
  program_psihologis!: program_psihologi[];
  getProgram_psihologis!: Sequelize.HasManyGetAssociationsMixin<program_psihologi>;
  setProgram_psihologis!: Sequelize.HasManySetAssociationsMixin<program_psihologi, program_psihologiId>;
  addProgram_psihologi!: Sequelize.HasManyAddAssociationMixin<program_psihologi, program_psihologiId>;
  addProgram_psihologis!: Sequelize.HasManyAddAssociationsMixin<program_psihologi, program_psihologiId>;
  createProgram_psihologi!: Sequelize.HasManyCreateAssociationMixin<program_psihologi>;
  removeProgram_psihologi!: Sequelize.HasManyRemoveAssociationMixin<program_psihologi, program_psihologiId>;
  removeProgram_psihologis!: Sequelize.HasManyRemoveAssociationsMixin<program_psihologi, program_psihologiId>;
  hasProgram_psihologi!: Sequelize.HasManyHasAssociationMixin<program_psihologi, program_psihologiId>;
  hasProgram_psihologis!: Sequelize.HasManyHasAssociationsMixin<program_psihologi, program_psihologiId>;
  countProgram_psihologis!: Sequelize.HasManyCountAssociationsMixin;

  async deleteProgramUser() {
    try {
      await program_psihologi.destroy({
        where: {
          user_id: this.user_id
        }
      })
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  // users hasMany programari via user_id
  programaris!: programari[];
  getProgramaris!: Sequelize.HasManyGetAssociationsMixin<programari>;
  setProgramaris!: Sequelize.HasManySetAssociationsMixin<programari, programariId>;
  addProgramari!: Sequelize.HasManyAddAssociationMixin<programari, programariId>;
  addProgramaris!: Sequelize.HasManyAddAssociationsMixin<programari, programariId>;
  createProgramari!: Sequelize.HasManyCreateAssociationMixin<programari>;
  removeProgramari!: Sequelize.HasManyRemoveAssociationMixin<programari, programariId>;
  removeProgramaris!: Sequelize.HasManyRemoveAssociationsMixin<programari, programariId>;
  hasProgramari!: Sequelize.HasManyHasAssociationMixin<programari, programariId>;
  hasProgramaris!: Sequelize.HasManyHasAssociationsMixin<programari, programariId>;
  countProgramaris!: Sequelize.HasManyCountAssociationsMixin;

  //sa fac chestia sa accepte programarea sau nu 
  //verificarea 0 neacceptat 1 acceptat 2 modificat 3 finalizata


  async adaugaProgramare(data_programare: Date, listaServicii: string) {
    try {
      const data_realizare = new Date(format(new Date(), 'yyyy-MM-dd HH:mm'));
      const parsedArray = JSON.parse(listaServicii);

      const programare = await programari.create({
        data_programare: data_programare,
        data_realizare: data_realizare,
        user_id: this.user_id
      });

      for (const serv of parsedArray) {
        programari_servicii.create({
          programare_id: programare.programare_id,
          seriviciu_id: serv
        });
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getProgramareById(programare_id: number) {
    const programare = await programari.findByPk(programare_id);
    return programare;
  }

  static async deleteProgramareById(programareId: number) {
    try {
      const programare = await programari.findByPk(programareId);
      if (!programare) {
        return false;
      }
      const programare_servicii = await programari_servicii.findOne({
        where: {
          programare_id: programare.programare_id
        }
      });
      await programare_servicii?.destroy();
      await programare.destroy();
      return true;
    } catch (error) {
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
        listaIdServicii.push(await programari_servicii.findAll({
          where: {
            programare_id: prog.programare_id,
          }
        }));
      }

      return listaIdServicii;
    } catch (error) {
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

      const programari_psiholog: programari_servicii[] = [];
      for (const serv of servicii) {

        const programare = await programari_servicii.findAll({
          where: {
            seriviciu_id: serv.seriviciu_id
          }
        });
        if (programare) {
          programari_psiholog.push(...programare);
        }
      }
      return programari_psiholog;
    } catch (error) {
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

  static async calculezTimpProgramare(programare: programari) {
    let total_minute = 0;
    const programare_servicii = await programari_servicii.findAll({
      where: { programare_id: programare.programare_id }
    });
    for (let i = 0; i < programare_servicii.length; i++) {
      const servici = await servicii.findByPk(programare_servicii[i].seriviciu_id);
      if (!servici) {
        continue;
      }
      const durata = servici.durata + 10;
      total_minute = durata + total_minute;
    }

    return total_minute;
  }

  static async calculezTimpServicii(listaServicii: any) {
    let total_minute = 0;
    for (let i = 0; i < listaServicii.length; i++) {
      const servici = await servicii.findByPk(listaServicii[i]);
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

  static adaugMinuteInOra(timp_initial: string, minute: number) {
    const date = new Date(timp_initial);
    date.setMinutes(date.getMinutes() + minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  static fusOrar(time: string): string {
    const [hour, minutes] = time.split(':');
    let newHour = parseInt(hour) - 3;

    // Asigurăm că rezultatul este în intervalul 0-23
    if (newHour < 0) {
      newHour += 24;
    }

    return `${newHour}:${minutes}`;
  }


  static async intervalProgramare(programare: programari) {


    // const ora_programare = programare.data_programare.toString();
    const ora_programare = moment(programare.data_programare, 'YYYY-MM-DD HH:mm').subtract(3, 'hours').format('YYYY-MM-DD HH:mm');
    const durataProgramare = await users.calculezTimpProgramare(programare);
    const ora_programare_finala = users.adaugMinuteInOra(ora_programare, durataProgramare);
    const bookedProgramare: { start: string, sfarsit: string } = {
      start: ora_programare.substring(11, 16),
      sfarsit: ora_programare_finala
    };

    return bookedProgramare;
  }


  //el trimite o lista de servicii data in care ar vrea sa se programeze si la ce psiholog
  //start_ora si top_ora sa le ia din program psiholog
  //this = client
  //program si sa mearga asta cu programul unui psiholog
  //isauthenticated cu ispsiholog is client is admin sa vad 
  static async intervaleProgramare(data_programare: string, psiholog_id: number, listaServicii: string) {
    try {
      let start_ora;
      let stop_ora;
      const data_curenta = moment().format('yyyy-MM-DD');
      const parsedArray = JSON.parse(listaServicii);

      const psiholog = await users.findByPk(psiholog_id);
      if (!psiholog) {
        return undefined;
      }
      //ar trebui sa iau data cand da click si sa vad daca este o zi muncitoare a lui 
      const program_psiholog = await psiholog.getProgram_psihologis();
      const data = new Date(data_programare);

      const ziua_saptamaniiProgramare = moment(data).weekday();
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

      const bookedProgramare: { start: string, sfarsit: string }[] = [];
      const availableProgramare: string[] = [];
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

        const durataServicii = await users.calculezTimpServicii(parsedArray);
        let oraCurenta = moment().startOf('hour').add(1, 'hour').format('HH:mm');

        let oraCurentaInterval = moment(oraCurenta, 'HH:mm');
        const start_oraInterval = moment(start_ora, 'HH:mm');
        const stop_oraInterval = moment(stop_ora, 'HH:mm');
        if (oraCurentaInterval.isSameOrBefore(start_oraInterval)) {
          oraCurentaInterval = start_oraInterval;
        }

        let aux: any;
        while (oraCurentaInterval.isBefore(stop_oraInterval)) {
          const oraProgramareSfarsit = users.adaugMinuteInOra(oraCurentaInterval.toString(), durataServicii);
          const oraProgramareSfarsitInterval = moment(oraProgramareSfarsit, 'HH:mm');

          const prog: { start: any, sfarsit: any } = {
            start: oraCurentaInterval,
            sfarsit: oraProgramareSfarsitInterval
          };

          const esteOcupat = bookedProgramare.some(interval => {
            const startInterval = moment(interval.start, 'HH:mm');
            const sfarsitInterval = moment(interval.sfarsit, 'HH:mm');
            aux = sfarsitInterval;
            return (
              (prog.start.isBefore(sfarsitInterval) && prog.sfarsit.isAfter(startInterval)) ||
              (prog.sfarsit.isAfter(startInterval) && prog.sfarsit.isBefore(sfarsitInterval))
            );
          })
          if (!esteOcupat) {
            availableProgramare.push(oraCurentaInterval.format('HH:mm'));

          } else {
            oraCurentaInterval = aux;
            continue;
          }
          if (oraCurentaInterval.minutes() != 0) {
            oraCurentaInterval = moment(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60 - aux.minutes()), 'HH:mm');
          }
          else {
            oraCurentaInterval = moment(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60), 'HH:mm');
          }

        }
        return { availableProgramare };
      } else {

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
        let oraCurentaInterval = moment(oraCurenta, 'HH:mm');
        const stop_oraInterval = moment(stop_ora, 'HH:mm');


        let aux: any;
        while (oraCurentaInterval.isBefore(stop_oraInterval)) {
          const oraProgramareSfarsit = users.adaugMinuteInOra(oraCurentaInterval.toString(), durataServicii);
          const oraProgramareSfarsitInterval = moment(oraProgramareSfarsit, 'HH:mm');

          const prog: { start: any, sfarsit: any } = {
            start: oraCurentaInterval,
            sfarsit: oraProgramareSfarsitInterval
          };

          const esteOcupat = bookedProgramare.some(interval => {
            const startInterval = moment(interval.start, 'HH:mm');
            const sfarsitInterval = moment(interval.sfarsit, 'HH:mm');
            aux = sfarsitInterval;
            return (
              (prog.start.isBefore(sfarsitInterval) && prog.sfarsit.isAfter(startInterval)) ||
              (prog.sfarsit.isAfter(startInterval) && prog.sfarsit.isBefore(sfarsitInterval))
            );
            //PRIMA:14:00 - 15:40 => 14:00 < 15:40 && 15:40 > 14:00 true -> se incadreaza in interval
            //A DOUA:daca sfarsitul e inaintea startInterval si daca sfarsitul este dupa sfarsit interval
          })
          if (!esteOcupat) {
            availableProgramare.push(oraCurentaInterval.format('HH:mm'));

          } else {
            oraCurentaInterval = aux;
            continue;
          }
          if (oraCurentaInterval.minutes() != 0) {
            oraCurentaInterval = moment(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60 - aux.minutes()), 'HH:mm');
          }
          else {
            oraCurentaInterval = moment(users.adaugMinuteInOra(oraCurentaInterval.toString(), 60), 'HH:mm');
          }

        }
        return { availableProgramare };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //de testat

  async getProgramariPsihologiByData(data_prog: any) {
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

      const programari_pshiolog: programari[] = [];


      const vector_frecventa: any = [];
      for (const prog_serv of programari_servici) {
        if (vector_frecventa.includes(prog_serv.programare_id)) {
          continue;
        }
        const rezultat = await programari.findOne({
          where: {
            programare_id: prog_serv.programare_id,
            [Sequelize.Op.and]: [
              sequelize.where(
                sequelize.fn('DATE', sequelize.col('data_programare')),
                data_programare
              )
            ]
          }
        }
        );
        if (rezultat) {
          programari_pshiolog.push(rezultat);
          vector_frecventa.push(prog_serv.programare_id);
        }
      }
      return programari_pshiolog;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getProgramareByData(data_prog: any) {
    try {
      const data = new Date(data_prog);
      const data_programare = data.toISOString().substring(0, 10);
      const programareExistenta = await programari.findAll({
        where: {
          user_id: this.user_id,
          [Sequelize.Op.and]: [
            sequelize.where(
              sequelize.fn('DATE', sequelize.col('data_programare')),
              data_programare
            )
          ]
        }
      });
      return programareExistenta;
    } catch (error) {
      console.log(error);
      return false;
    }
  }



  async getOneProgramareByData(data_prog: any, id: any) {
    try {
      const data = new Date(data_prog);
      const data_programare = data.toISOString().substring(0, 10);
      const programareExistenta = await programari.findOne({
        where: {
          user_id: this.user_id,
          [Sequelize.Op.and]: [
            sequelize.where(
              sequelize.fn('DATE', sequelize.col('data_programare')),
              data_programare
            )
          ]
        }
      });
      return programareExistenta;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  //SERVICII DE ACTUALIZAT



  static async deleteServiciuById(id: number) {
    try {
      const deletedServiciu = await servicii.findByPk(id);
      await deletedServiciu?.destroy();
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getListaSpecializariServicii() {
    const specializari = await this.getSpecializari();
    const serviciiPromises = specializari.map((specializare) => {
      return servicii.findAll({
        where: {
          specializare_id: specializare.specializare_id
        }
      }).then(serviciiArray => ({ specializare, servicii: serviciiArray }))
    });

    let serviciiSiSpecializari = await Promise.all(serviciiPromises);

    if (serviciiSiSpecializari.length === 0) {
      return null;
    }
    return serviciiSiSpecializari;
  }

  async getListaServiciiPsiholog() {
    const specializari = await this.getSpecializari();
    let listaServicii: servicii[];
    const serviciiPromises = specializari.map((specializare) => {
      return servicii.findAll({
        where: {
          specializare_id: specializare.specializare_id
        }
      })
    });

    let serviciiUser = await Promise.all(serviciiPromises);
    listaServicii = serviciiUser.flat();

    if (listaServicii.length === 0) {
      return null;
    }
    return listaServicii;
  }

  async getServiciiByDenumire(denumire: string) {
    const serviciuGasit = await servicii.findOne({
      where: {
        denumire: denumire,
        user_id: this.user_id
      }
    });

    return serviciuGasit;
  }

  static async getServiciuById(id: number) {
    const serviciu = await servicii.findByPk(id);
    return serviciu;
  }



  // users hasMany ratings via user_id
  ratings!: ratings[];
  getRatings!: Sequelize.HasManyGetAssociationsMixin<ratings>;
  setRatings!: Sequelize.HasManySetAssociationsMixin<ratings, ratingsId>;
  addRating!: Sequelize.HasManyAddAssociationMixin<ratings, ratingsId>;
  addRatings!: Sequelize.HasManyAddAssociationsMixin<ratings, ratingsId>;
  createRating!: Sequelize.HasManyCreateAssociationMixin<ratings>;
  removeRating!: Sequelize.HasManyRemoveAssociationMixin<ratings, ratingsId>;
  removeRatings!: Sequelize.HasManyRemoveAssociationsMixin<ratings, ratingsId>;
  hasRating!: Sequelize.HasManyHasAssociationMixin<ratings, ratingsId>;
  hasRatings!: Sequelize.HasManyHasAssociationsMixin<ratings, ratingsId>;
  countRatings!: Sequelize.HasManyCountAssociationsMixin;
  // users belongsToMany reviews via user_id and review_id
  review_id_reviews!: reviews[];
  getReview_id_reviews!: Sequelize.BelongsToManyGetAssociationsMixin<reviews>;
  setReview_id_reviews!: Sequelize.BelongsToManySetAssociationsMixin<reviews, reviewsId>;
  addReview_id_review!: Sequelize.BelongsToManyAddAssociationMixin<reviews, reviewsId>;
  addReview_id_reviews!: Sequelize.BelongsToManyAddAssociationsMixin<reviews, reviewsId>;
  createReview_id_review!: Sequelize.BelongsToManyCreateAssociationMixin<reviews>;
  removeReview_id_review!: Sequelize.BelongsToManyRemoveAssociationMixin<reviews, reviewsId>;
  removeReview_id_reviews!: Sequelize.BelongsToManyRemoveAssociationsMixin<reviews, reviewsId>;
  hasReview_id_review!: Sequelize.BelongsToManyHasAssociationMixin<reviews, reviewsId>;
  hasReview_id_reviews!: Sequelize.BelongsToManyHasAssociationsMixin<reviews, reviewsId>;
  countReview_id_reviews!: Sequelize.BelongsToManyCountAssociationsMixin;
  // users hasMany specializari via user_id
  specializaris!: specializari[];
  getSpecializaris!: Sequelize.HasManyGetAssociationsMixin<specializari>;
  setSpecializaris!: Sequelize.HasManySetAssociationsMixin<specializari, specializariId>;
  addSpecializari!: Sequelize.HasManyAddAssociationMixin<specializari, specializariId>;
  addSpecializaris!: Sequelize.HasManyAddAssociationsMixin<specializari, specializariId>;
  createSpecializari!: Sequelize.HasManyCreateAssociationMixin<specializari>;
  removeSpecializari!: Sequelize.HasManyRemoveAssociationMixin<specializari, specializariId>;
  removeSpecializaris!: Sequelize.HasManyRemoveAssociationsMixin<specializari, specializariId>;
  hasSpecializari!: Sequelize.HasManyHasAssociationMixin<specializari, specializariId>;
  hasSpecializaris!: Sequelize.HasManyHasAssociationsMixin<specializari, specializariId>;
  countSpecializaris!: Sequelize.HasManyCountAssociationsMixin;


  static async deleteSpecializareById(id: number) {
    try {
      const deletedSpecializare = await specializari.findByPk(id);
      await servicii.destroy({
        where: {
          specializare_id: deletedSpecializare?.specializare_id
        }
      })
      await deletedSpecializare?.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getSpecializari() {
    const specializaris = await specializari.findAll({
      where: {
        user_id: this.user_id
      },
      attributes: { exclude: ['poza_diploma'] }
    });
    return specializaris;
  }

  async getSpecializariByDenumire(denumire: string) {
    const specializareGasita = await specializari.findOne({
      where: {
        denumire_specializare: denumire,
        user_id: this.user_id
      },
      attributes: { exclude: ['poza_diploma'] }
    });
    return specializareGasita;
  }


  // users hasMany subscriptions via user_id
  subscriptions!: subscriptions[];
  getSubscriptions!: Sequelize.HasManyGetAssociationsMixin<subscriptions>;
  setSubscriptions!: Sequelize.HasManySetAssociationsMixin<subscriptions, subscriptionsId>;
  addSubscription!: Sequelize.HasManyAddAssociationMixin<subscriptions, subscriptionsId>;
  addSubscriptions!: Sequelize.HasManyAddAssociationsMixin<subscriptions, subscriptionsId>;
  createSubscription!: Sequelize.HasManyCreateAssociationMixin<subscriptions>;
  removeSubscription!: Sequelize.HasManyRemoveAssociationMixin<subscriptions, subscriptionsId>;
  removeSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<subscriptions, subscriptionsId>;
  hasSubscription!: Sequelize.HasManyHasAssociationMixin<subscriptions, subscriptionsId>;
  hasSubscriptions!: Sequelize.HasManyHasAssociationsMixin<subscriptions, subscriptionsId>;
  countSubscriptions!: Sequelize.HasManyCountAssociationsMixin;




  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "user_name_UNIQUE"
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "email_UNIQUE"
      },
      user_type: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      nume: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      prenume: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      sessionToken: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      user_password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nr_telefon: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      poza: {
        type: DataTypes.BLOB('medium'),
        allowNull: true
      },
      verificat: {
        type: DataTypes.TINYINT,
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




