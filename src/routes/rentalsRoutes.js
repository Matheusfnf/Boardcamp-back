import { Router } from "express";
import rentalsController from "../controllers/rentals.controller.js";

const router = new Router();

router.get("/", rentalsController.show);
router.post("/", rentalsController.store);
router.post("/:id/return", rentalsController.update);
router.delete("/:id", rentalsController.delete);

export default router;
