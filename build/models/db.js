"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.connectDb = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const multer_1 = __importDefault(require("multer"));
const init_models_1 = require("../models/init-models");
//calculatorul meu 
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    database: 'mydb',
    port: 3307,
});
//docker
// export const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: '172.23.0.2',
//     username: 'root',
//     password: 'root',
//     database: 'mydb',
//     port: 3306,
//   });
async function connectDb() {
    try {
        await exports.sequelize.authenticate();
        (0, init_models_1.initModels)(exports.sequelize);
        console.log("Conexiunea la baza de date realizata cu succes");
    }
    catch (error) {
        console.log(error);
    }
    ;
}
exports.connectDb = connectDb;
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 4 // limitează dimensiunea fișierului la 5 MB
    },
    fileFilter: (req, file, cb) => {
        // verifică tipul fișierului sau alte validări
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true); // acceptă fișierul
        }
        else {
            cb(new Error('Tipul de fișier nu este acceptat')); // respinge fișierul
        }
    }
});
//# sourceMappingURL=db.js.map