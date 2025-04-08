import express from "express";
import multer from "multer";
import {
  uploadLungFile,
  downloadLungFile,
  updateLungFile,
  deleteLungFile,
} from "../controllers/LungFileController";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời

router.post("/upload", upload.single("file"), uploadLungFile);
router.get("/download/:case_submitter_id/:fileType", downloadLungFile);
router.put("/update", upload.single("file"), updateLungFile);
router.delete("/delete/:case_submitter_id/:fileType", deleteLungFile);

export default router;