import { Router } from "express";
import UserController from './controllers/UserController';
import AuthController from "./controllers/AuthController";
import NetworkController from "./controllers/NetworkController";
import VisitorController from "./controllers/VisitorController";

const router = Router();
const version = "v1";
import middlewares from "./middlewares/middlewares";

const m = middlewares;

//Autenticação
router.post('/auth/'+version, AuthController.auth);
router.post('/logout/'+version, m.authMiddleware, AuthController.logout);

//Rotas do CRUD de usuários
router.get('/users/'+version,           m.authMiddleware, m.adminRole, UserController.index);
router.get('/users/'+version+'/:id',    m.authMiddleware, m.adminRole, UserController.show);
router.post('/users/'+version,          m.authMiddleware, m.adminRole, UserController.store);
router.put('/users/'+version+'/:id',    m.authMiddleware, m.adminRole, UserController.update);
router.delete('/users/'+version+'/:id', m.authMiddleware, m.adminRole, UserController.delete);

//Rotas do CRUD de redes
router.get('/networks/'+version,           m.authMiddleware, m.adminRole, NetworkController.index);
router.get('/networks/'+version+'/:id',    m.authMiddleware, m.adminRole, NetworkController.show);
router.post('/networks/'+version,          m.authMiddleware, m.adminRole, NetworkController.store);
router.put('/networks/'+version+'/:id',    m.authMiddleware, m.adminRole, NetworkController.update);
router.delete('/networks/'+version+'/:id', m.authMiddleware, m.adminRole, NetworkController.delete);

//Rotas do CRUD de visitantes
router.get('/visitors/'+version,           m.authMiddleware, VisitorController.index);
router.get('/visitors/'+version+'/:id',    m.authMiddleware, VisitorController.show);
router.post('/visitors/'+version,          m.authMiddleware, VisitorController.store);
router.put('/visitors/'+version+'/:id',    m.authMiddleware, VisitorController.update);
router.delete('/visitors/'+version+'/:id', m.authMiddleware, VisitorController.delete);


module.exports = router;
