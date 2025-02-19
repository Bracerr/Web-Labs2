import { Router } from "express";
import { userHandler } from "../handlers/userHandler.js";

const router = new Router();

router.get('/', (req, res) => {
    res.send({message: 'Ok'});
})

router.post('/users', userHandler.createUser);

router.get('/users', userHandler.getAllUsers);

export { router };