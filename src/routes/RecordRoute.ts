import express from "express";
import RecordController from "../controllers/RecordController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, RecordController.getRecord); // Lấy danh sách Record
router.post("/", jwtCheck, jwtParse, RecordController.addRecord); // Thêm Record
router.put("/:id", jwtCheck, jwtParse, RecordController.editRecord); // Sửa Record
router.delete("/:id", jwtCheck, jwtParse, RecordController.removeRecord); // Xóa Record

export default router;