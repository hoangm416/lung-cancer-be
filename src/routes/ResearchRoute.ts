import express from "express";
import { param } from "express-validator";
import ResearchController from "../controllers/ResearchController";

const router = express.Router();

router.get(
    "/:id",
    param("id")
        .isMongoId()
        .notEmpty()
        .withMessage("ID không hợp lệ"),
    ResearchController.getResearchById
);

router.get("/", ResearchController.getAllResearches);

router.get("/:type/:slug", ResearchController.getResearchBySlug);

router.post("/", ResearchController.createResearch);

router.put(
    "/:id",
    param("id")
        .isMongoId()
        .withMessage("ID không hợp lệ"),
    ResearchController.updateResearch
);

router.delete(
    "/:id",
    param("id")
        .isMongoId()
        .withMessage("ID không hợp lệ"),
    ResearchController.deleteResearch
);

export default router;
