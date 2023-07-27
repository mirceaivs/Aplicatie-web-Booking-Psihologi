"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./models/db");
const user_r_1 = __importDefault(require("./routes/user_r"));
const body_parser_1 = __importDefault(require("body-parser"));
const admin_r_1 = __importDefault(require("./routes/admin_r"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//utils
(0, db_1.connectDb)();
const app = (0, express_1.default)();
app.use(db_1.upload.single('poza'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
//routes
//CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use('/api/admin', admin_r_1.default);
app.use('/api/user', user_r_1.default);
//random
app.get('/', (req, res) => {
    res.send('ceva!');
});
//server port
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
// import https from 'https';
// import fs from 'fs';
// const httpOptions = {
//   key:fs.readFileSync('./certs/server.key'),
//   cert:fs.readFileSync('./certs/server.crt')
// };
// const server = https.createServer(httpOptions, app);
//# sourceMappingURL=app.js.map