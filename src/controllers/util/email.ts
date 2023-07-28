import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import moment from 'moment';
import { programari } from '../../models/programari';
import { users } from '../../models/users';
import { ICalCalendar, ICalEvent } from 'ical-generator';
import * as fs from 'fs';
// Configurare transporter pentru trimiterea email-urilor

const CLIENT_ID = '935576037769-p9djsd1ua5oqv9cbf6m9vgttd2h8dc5c.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';


const REFRESH_TOKEN = '1//04lVrw3gqK5ASCgYIARAAGAQSNwF-L9IrXKC19ppbveNs4--BfyFHtkkMgELsWTO6wqIHDvsjE-nwxk5ceShKsgE_wlFu3E2gevs';
const AUTHORIZATION_CODE = '4/0AbUR2VOPfshs6BSO6ulx68Qf0YWCBBTutlxpw9kaHFQmdCfodALbwZdhjEBWujn3RdhEHA'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//ACCESSTOKEN=

export const sendVerificareEmail = async (email: string, url: string) => {
    try {


        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Cod de verificare cont',
            html: `Linkul de verificare este: <a href="${url}">${url}</a>`,
        };


        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');

    } catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};


export const GoogleCalendar = async (programare: programari, email: string, nume: string) => {
    const interval = await users.intervalProgramare(programare);
    const date = new Date(programare.data_programare).toISOString().slice(0, 10);
    const startDateTime = new Date(date + "T" + interval.start + ":00Z").toISOString();
    const endDateTime = new Date(date + "T" + interval.sfarsit + ":00Z").toISOString();
    const calendar = new ICalCalendar();
    const event = new ICalEvent({
        start: startDateTime,
        end: endDateTime,
        summary: `Programare la ${nume}`,
    }, calendar);
    event.timezone('GMT+2');
    calendar.events([event]);

    const icsData = calendar.toString();

    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'mircea.ivascu17@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    } as nodemailer.TransportOptions);

    const mailOptions = {
        from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
        to: email,
        subject: 'Adaugarea programarii in calendar',
        text: 'Descarcati si deschideti fisierul pentru a adauga programarea in calendarul dumneavoastra personal',
        icalEvent: {
            filename: 'programare.ics',
            content: icsData,
        },
    };

    await transporter.sendMail(mailOptions);
    console.log('Email trimis cu succes');
}




export const sendProgramareNoua = async (email: string, url: string) => {
    try {


        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Programare noua',
            html: `Ai o programare noua! Poti urmari linkul urmator pentru a confirma programarea: <a href="${url}">${url}</a>`
        };


        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');

    } catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};

export const sendConfirmareProgramare = async (email: string, psiholog_numeprenume: string) => {
    try {


        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Programare noua',
            html: `Programarea la <i> ${psiholog_numeprenume} </i> a fost confirmata de catre specialist!`
        };


        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');

    } catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};

