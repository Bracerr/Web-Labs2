import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {
    res.send({message: 'Ok'});
})

export default router;