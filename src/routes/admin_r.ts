import express, { Request, Response } from 'express';
import { createUser, login } from '../controllers/auth';
import { deleteUser, deleteUserAdmin, getAllUsers, getUserByEmail, getUserById } from '../controllers/users';
import { isAdmin, isAuthenticated } from '../middlewares';
import { adaugaCabinet } from '../controllers/cabinete';
import { deleteSpecializare, getAllSpecializari, verificareSpecializare } from '../controllers/specializari';

const router = express.Router();

//DE MODIFICAT

router.get('/user/:email', isAuthenticated, isAdmin, getUserByEmail);
router.get('/users', isAuthenticated, isAdmin, getAllUsers);
router.delete('/user/delete/:id', isAuthenticated, deleteUser);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteUserAdmin);
router.delete('/specializare/delete/:id', isAuthenticated, isAdmin, deleteSpecializare);
router.get('/user/id/:id', isAuthenticated, isAdmin, getUserById);
router.post('/cabinete/adauga', isAuthenticated, isAdmin, adaugaCabinet);
router.get('/specializari/verifica/:id', isAuthenticated, isAdmin, verificareSpecializare);
router.get('/specializari', isAuthenticated, isAdmin, getAllSpecializari);
export default router;