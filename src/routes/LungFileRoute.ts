import express from "express";
import multer from "multer";
import {
  getFilesForRecord,
  uploadFile,
  deleteFile,
  renameFile,
} from "../controllers/LungFileController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Sử dụng memory storage để xử lý file trực tiếp

// Route để lấy danh sách file liên quan đến một record
router.get("/:case_submitter_id/files", getFilesForRecord);

// Route để upload file lên Cloudinary và lưu thông tin vào DB
router.post("/upload", upload.single("file"), uploadFile);

// Route để đổi tên file trong DB
router.patch("/rename", renameFile);

// Route để xóa file khỏi Cloudinary và DB
router.delete("/delete/:case_submitter_id/:fileType", deleteFile);

export default router;