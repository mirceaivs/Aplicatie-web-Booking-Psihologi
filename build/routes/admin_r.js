"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const middlewares_1 = require("../middlewares");
const cabinete_1 = require("../controllers/cabinete");
const specializari_1 = require("../controllers/specializari");
const router = express_1.default.Router();
//DE MODIFICAT
router.get('/user/:email', middlewares_1.isAuthenticated, middlewares_1.isAdmin, users_1.getUserByEmail);
router.get('/users', middlewares_1.isAuthenticated, middlewares_1.isAdmin, users_1.getAllUsers);
router.delete('/user/delete/:id', middlewares_1.isAuthenticated, users_1.deleteUser);
router.get('/user/id/:id', middlewares_1.isAuthenticated, middlewares_1.isAdmin, users_1.getUserById);
router.post('/cabinete/adauga', middlewares_1.isAuthenticated, middlewares_1.isAdmin, cabinete_1.adaugaCabinet);
router.get('/specializari/verifica/:id', middlewares_1.isAuthenticated, middlewares_1.isAdmin, specializari_1.verificareSpecializare);
router.get('/specializari', middlewares_1.isAuthenticated, middlewares_1.isAdmin, specializari_1.getAllSpecializari);
exports.default = router;
//# sourceMappingURL=admin_r.js.map