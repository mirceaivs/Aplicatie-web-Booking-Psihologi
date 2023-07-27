export type User = {
    user_id: number,
    nume: string,
    prenume: string,
    user_type: string,
    email: string,
    nr_telefon: string,
    user_name: string
}

export type Cabinete = {
    cabinet_id: number,
    user_id: number,
    denumire_Cabinet: string,
    judet: string,
    localitate: string,
    adresa: string
}

export type Specializari = {
    specializare_id: number,
    nr_atestat: string,
    denumire_specializare: string,
    verificat: number,
    user_id: number
}

export type Servici = {
    seriviciu_id: number;
    denumire: string;
    pret: number;
    durata: number;
    descriere: string;
    specializare_id: number;
    user_id: number;
}

export type Programe = {
    ziua_saptamanii: string;
    ora_inceput: string;
    ora_sfarsit: string;
}

export type Programaris = {
    programare_id: number;
    data_programare: string;
    data_realizare: string;
    aprobat: number;
    user_id: number;
    user_nume: string;
    user_prenume: string;
    user_telefon: string;
}

// export type Programaris = {
//     programare: {
//         data_programare?: Date;
//         programare_id?: number;
//         user_id: number;
//         aprobat: number;
//     };
//     user: {
//         user_nume: string;
//         user_prenume: string;
//     };
// }