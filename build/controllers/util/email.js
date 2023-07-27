"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmareProgramare = exports.sendProgramareNoua = exports.sendVerificareEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
// Configurare transporter pentru trimiterea email-urilor
const CLIENT_ID = '935576037769-p9djsd1ua5oqv9cbf6m9vgttd2h8dc5c.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//0478U75ypse4OCgYIARAAGAQSNwF-L9IrMAd3VZThCNU6JsQdwguBrAW1dbznH108wIjtpHKyt3rmwJKY8DhfmldtYroPfrGj50k';
const AUTHORIZATION_CODE = '4/0AbUR2VOPfshs6BSO6ulx68Qf0YWCBBTutlxpw9kaHFQmdCfodALbwZdhjEBWujn3RdhEHA';
const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//ACCESSTOKEN=
const sendVerificareEmail = async (email, url) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Cod de verificare cont',
            html: `Linkul de verificare este: <a href="${url}">${url}</a>`,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');
    }
    catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};
exports.sendVerificareEmail = sendVerificareEmail;
const sendProgramareNoua = async (email, url) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Programare noua',
            html: `Ai o programare noua! Poti urmari linkul urmator pentru a confirma programarea: <a href="${url}">${url}</a>`
        };
        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');
    }
    catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};
exports.sendProgramareNoua = sendProgramareNoua;
const sendConfirmareProgramare = async (email, psiholog_numeprenume) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mircea.ivascu17@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: 'LICENTA-EMAIL-API <mircea.ivascu17@gmail.com>',
            to: email,
            subject: 'Programare noua',
            html: `Programarea la <i> ${psiholog_numeprenume} </i> a fost confirmata de catre specialist!`
        };
        await transporter.sendMail(mailOptions);
        console.log('Email trimis cu succes');
    }
    catch (error) {
        console.error('Eroare la trimiterea email-ului:', error);
    }
};
exports.sendConfirmareProgramare = sendConfirmareProgramare;
//# sourceMappingURL=email.js.map