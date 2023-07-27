"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const middlewares_1 = require("../middlewares");
const cabinete_1 = require("../controllers/cabinete");
const users_1 = require("../controllers/users");
const servicii_1 = require("../controllers/servicii");
const specializari_1 = require("../controllers/specializari");
const programari_1 = require("../controllers/programari");
const progam_psihologi_1 = require("../controllers/progam_psihologi");
const router = express_1.default.Router();
//user
router.post('/register', auth_1.createUser);
router.post('/login', auth_1.login);
router.delete('/logout', auth_1.logout);
router.post('/update', middlewares_1.isAuthenticated, users_1.updateUser);
router.get('/poza/:id', users_1.getPozaUser);
router.get('/user/:id', middlewares_1.isAuthenticated, users_1.getUserById);
router.get('/islogged', middlewares_1.isAuthenticated, users_1.getUserByCookie);
router.get('/verificare/:token', auth_1.verificaToken);
router.post('/recuperareparola', auth_1.recuperareParola);
router.get('/recuperareparola/:token', auth_1.verificaTokenRecParola);
router.post('/updateparola', users_1.updateParola);
router.post('/search/', middlewares_1.isAuthenticated, users_1.SearchEngine);
//cabinete
router.post('/cabinete/adauga', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, cabinete_1.adaugaCabinet);
router.get('/cabinete/:id', middlewares_1.isAuthenticated, cabinete_1.getCabinete);
router.get('/cabinete/:denumire', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, cabinete_1.getCabinetbyByDenumire);
router.delete('/cabinete/delete/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, cabinete_1.deleteCabinet);
router.post('/cabinete/update/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, cabinete_1.updateCabinet);
router.get('/cabinet/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, cabinete_1.getCabinetById);
//servicii
router.post('/servicii/adauga/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, servicii_1.adaugaServiciu);
router.get('/servicii/:id', middlewares_1.isAuthenticated, servicii_1.getServicii);
router.get('/servicii/psiholog', middlewares_1.isAuthenticated, servicii_1.getServiciiSpecializari);
router.get('/servicii/:denumire', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, servicii_1.getServiciiByDenumire);
router.delete('/servicii/delete/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, servicii_1.deleteServiciu);
router.post('/servicii/update/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, servicii_1.updateServiciu);
router.get('/serviciu/:id', middlewares_1.isAuthenticated, servicii_1.getServiciuById);
router.get('/servicii/verificat/:id', servicii_1.getAllVerificatServicii);
//specializari
router.post('/specializari/adauga', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, specializari_1.adaugaSpecializare);
router.get('/specializari/:id', middlewares_1.isAuthenticated, specializari_1.getSpecializari);
router.get('/specializare/:id', middlewares_1.isAuthenticated, specializari_1.getSpecializare);
router.get('/specializari/:denumire', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, specializari_1.getSpecializareDenumire);
router.delete('/specializari/delete/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, specializari_1.deleteSpecializare);
router.post('/specializari/update/:id', middlewares_1.isAuthenticated, specializari_1.updateSpecializare);
router.get('/specializari/poza/:id', middlewares_1.isAuthenticated, specializari_1.getPoza);
//program_psiholog
router.post('/programpsiholog/adauga', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, progam_psihologi_1.adaugaProgram);
router.get('/programpsiholog/:id', middlewares_1.isAuthenticated, progam_psihologi_1.getProgramPsihologById);
router.delete('/programpsiholog/delete/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, progam_psihologi_1.deleteProgram);
//programari il fac client 
router.post('/programari/intervale/:id', middlewares_1.isAuthenticated, programari_1.intervaleOrare);
router.post('/programari/adauga', middlewares_1.isAuthenticated, middlewares_1.isClient, programari_1.adaugaProgramare);
// isClient , isAuthenticated,
//de facut client
router.get('/programari/client', middlewares_1.isAuthenticated, middlewares_1.isClient, programari_1.getProgramareClient);
//isClient,
//a psihologului
router.get('/programari/psiholog', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, programari_1.getProgramarePsiholog);
// isAuthenticated, isPsiholog ,
router.get('/programari/psiholog/:id', middlewares_1.isAuthenticated, middlewares_1.isPsiholog, programari_1.getServiciiProgPsiholog);
//
//pun psiholog la programare
router.delete('/programari/delete/:id', middlewares_1.isAuthenticated, programari_1.deleteProgramare);
router.get('/programari/update/:id', middlewares_1.isAuthenticated, programari_1.updateProgramare);
//e do auth 
router.get('/programari/id/:id', middlewares_1.isAuthenticated, programari_1.getProgramareById);
exports.default = router;
//# sourceMappingURL=user_r.js.map