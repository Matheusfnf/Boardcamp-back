import { Router } from "express";
import gamesController from "../controllers/games.controller.js";

const router = new Router();

router.get("/games", gamesController.show);
router.post("/games", gamesController.store);

export default router;
