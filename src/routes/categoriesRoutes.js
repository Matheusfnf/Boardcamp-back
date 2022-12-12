import { Router } from "express";
import categoriesController from "../controllers/categories.controller.js";

const router = new Router();

router.get("/categories", categoriesController.show);
router.post("/categories", categoriesController.store);

export default router;
