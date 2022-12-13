import { Router } from "express";
import customersController from "../controllers/customers.controller.js";

const router = new Router();

router.get("/customers", customersController.show);
router.get("/customers/:id", customersController. showid);
router.put("/customers/:id", customersController.update);
router.post("/customers", customersController.store);
export default router;
