import {Router } from "express";
import { listingsController } from "../controllers/listings.controller";

const router = Router();

router.get("/", listingsController.getAll);
router.get("/:id", listingsController.getById);
router.post("/", listingsController.create);
router.delete("/:id", listingsController.delete);

export default router;