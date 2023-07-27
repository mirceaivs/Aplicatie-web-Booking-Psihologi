import { createUser, login, logout, recuperareParola, verificaToken, verificaTokenRecParola } from '../controllers/auth';
import { isAuthenticated, isClient, isPsiholog } from '../middlewares';
import { adaugaCabinet, deleteCabinet, getCabinetById, getCabinetbyByDenumire, getCabinete, updateCabinet } from '../controllers/cabinete';
import { SearchEngine, deleteUser, getPozaUser, getUserByCookie, getUserById, updateParola, updateUser } from '../controllers/users';
import { adaugaServiciu, deleteServiciu, getAllVerificatServicii, getServicii, getServiciiByDenumire, getServiciiSpecializari, getServiciuById, updateServiciu } from '../controllers/servicii';
import { adaugaSpecializare, deleteSpecializare, getPoza, getSpecializare, getSpecializareDenumire, getSpecializari, updateSpecializare } from '../controllers/specializari';
import { adaugaProgramare, deleteProgramare, getProgramareById, getProgramareClient, getProgramarePsiholog, getServiciiProgPsiholog, googleCalendar, intervaleOrare, updateProgramare } from '../controllers/programari';
import { adaugaProgram, deleteProgram, getProgramPsihologById } from '../controllers/progam_psihologi';

import express from 'express';
const router = express.Router();
router.post('/login', login);

//user
router.post('/register', createUser);
router.delete('/logout', logout);
router.post('/update', isAuthenticated, updateUser);
router.get('/poza/:id', getPozaUser)
router.get('/user/:id', isAuthenticated, getUserById);
router.get('/islogged', isAuthenticated, getUserByCookie);
router.get('/verificare/:token', verificaToken);
router.post('/recuperareparola', recuperareParola);
router.get('/recuperareparola/:token', verificaTokenRecParola);
router.post('/updateparola', updateParola);
router.post('/search/', isAuthenticated, SearchEngine);

//cabinete
router.post('/cabinete/adauga', isAuthenticated, isPsiholog, adaugaCabinet);
router.get('/cabinete/:id', isAuthenticated, getCabinete);
router.get('/cabinete/:denumire', isAuthenticated, isPsiholog, getCabinetbyByDenumire);
router.delete('/cabinete/delete/:id', isAuthenticated, isPsiholog, deleteCabinet);
router.post('/cabinete/update/:id', isAuthenticated, isPsiholog, updateCabinet);
router.get('/cabinet/:id', isAuthenticated, isPsiholog, getCabinetById);

//servicii
router.post('/servicii/adauga/:id', isAuthenticated, isPsiholog, adaugaServiciu);
router.get('/servicii/:id', isAuthenticated, getServicii);
router.get('/servicii/psiholog', isAuthenticated, getServiciiSpecializari);
router.get('/servicii/:denumire', isAuthenticated, isPsiholog, getServiciiByDenumire);
router.delete('/servicii/delete/:id', isAuthenticated, isPsiholog, deleteServiciu);

router.post('/servicii/update/:id', isAuthenticated, isPsiholog, updateServiciu);
router.get('/serviciu/:id', isAuthenticated, getServiciuById);
router.get('/servicii/verificat/:id', getAllVerificatServicii);


//specializari

router.post('/specializari/adauga', isAuthenticated, isPsiholog, adaugaSpecializare);
router.get('/specializari/:id', isAuthenticated, getSpecializari);
router.get('/specializare/:id', isAuthenticated, getSpecializare);
router.get('/specializari/:denumire', isAuthenticated, isPsiholog, getSpecializareDenumire);
router.delete('/specializari/delete/:id', isAuthenticated, isPsiholog, deleteSpecializare);
router.post('/specializari/update/:id', isAuthenticated, updateSpecializare);
router.get('/specializari/poza/:id', isAuthenticated, getPoza);

//program_psiholog

router.post('/programpsiholog/adauga', isAuthenticated, isPsiholog, adaugaProgram);
router.get('/programpsiholog/:id', isAuthenticated, getProgramPsihologById);
router.delete('/programpsiholog/delete/:id', isAuthenticated, isPsiholog, deleteProgram);


//programari il fac client 
router.post('/programari/calendar/:id', isAuthenticated, googleCalendar);
router.post('/programari/intervale/:id', isAuthenticated, intervaleOrare);
router.post('/programari/adauga', isAuthenticated, isClient, adaugaProgramare);
// isClient , isAuthenticated,
//de facut client
router.get('/programari/client', isAuthenticated, isClient, getProgramareClient);
//isClient,
//a psihologului
router.get('/programari/psiholog', isAuthenticated, isPsiholog, getProgramarePsiholog);
// isAuthenticated, isPsiholog ,
router.get('/programari/psiholog/:id', isAuthenticated, getServiciiProgPsiholog);
//

//pun psiholog la programare
router.delete('/programari/delete/:id', isAuthenticated, deleteProgramare);
router.get('/programari/update/:id', isAuthenticated, updateProgramare);
//e do auth 
router.get('/programari/id/:id', isAuthenticated, getProgramareById);

export default router;