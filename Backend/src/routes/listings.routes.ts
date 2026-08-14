import { Router } from "express";
import { listingsController } from "../controllers/listings.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", listingsController.getAll);
router.get("/:id", listingsController.getById);
router.post("/", requireAuth, listingsController.create);
router.delete("/:id", requireAuth, listingsController.delete);

export default router;