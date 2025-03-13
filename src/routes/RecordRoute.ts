import express from "express";
import RecordController from "../controllers/RecordController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", RecordController.getRecords);

export default router;
