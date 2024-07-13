import { currentUser } from "@porufantasy/yahoofantasy";
import express from "express";

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    console.log("get the request in currentUser");
    res.send({currentUser: req.currentUser || null});
})

export { router as currentUserRouter }