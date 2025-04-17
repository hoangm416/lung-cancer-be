import { Request, Response } from "express";
import MultiOmics from "../models/multiomics";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lấy danh sách file liên quan đến một record
export const getFilesForRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id } = req.params;

    if (!case_submitter_id) {
      res.status(400).json({ message: "Thiếu case_submitter_id" });
      return;
    }

    const multiOmicsRecord = await MultiOmics.findOne({ case_submitter_id });
    if (!multiOmicsRecord) {
      res.status(404).json({ message: "Không tìm thấy hồ sơ MultiOmics" });
      return;
    }

    res.status(200).json({ files: multiOmicsRecord.files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách file" });
  }
};

// Upload file lên Cloudinary và lưu thông tin vào DB
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);

    const { case_submitter_id, fileType, fileName } = req.body;

    if (!req.file || !case_submitter_id || !fileType) {
      res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      return;
    }

    const validFileTypes = ["cnv", "dna_methylation", "miRNA", "gene_expression"] as const;
    if (!validFileTypes.includes(fileType)) {
      res.status(400).json({ message: "Loại file không hợp lệ" });
      return;
    }

    // Upload file từ buffer
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file?.buffer); // Gửi buffer tới Cloudinary
    });

    const multiOmicsRecord = await MultiOmics.findOne({ case_submitter_id });
    if (!multiOmicsRecord) {
      res.status(404).json({ message: "Không tìm thấy hồ sơ MultiOmics" });
      return;
    }

    // Thêm file mới vào danh sách files
    multiOmicsRecord.files.push({
      file_type: fileType,
      file_url: (uploadResponse as any).secure_url,
      file_name: fileName || req.file.originalname,
    });

    await multiOmicsRecord.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: multiOmicsRecord.files[multiOmicsRecord.files.length - 1],
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Lỗi khi upload file" });
  }
};

// Xóa file trên Cloudinary và DB
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType } = req.params;

    if (!case_submitter_id || !fileType) {
      res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      return;
    }

    const multiOmicsRecord = await MultiOmics.findOne({ case_submitter_id });
    if (!multiOmicsRecord) {
      res.status(404).json({ message: "Không tìm thấy hồ sơ MultiOmics" });
      return;
    }

    const fileIndex = multiOmicsRecord.files.findIndex((f) => f.file_type === fileType);
    if (fileIndex === -1) {
      res.status(404).json({ message: "Không tìm thấy file để xóa" });
      return;
    }

    // Xóa file trên Cloudinary
    const fileUrl = multiOmicsRecord.files[fileIndex].file_url;
    const publicId = fileUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });
    }

    // Xóa file khỏi DB
    multiOmicsRecord.files.splice(fileIndex, 1);
    await multiOmicsRecord.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Lỗi khi xóa file" });
  }
};

// Đổi tên file trong DB
export const renameFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType, newFileName } = req.body;

    if (!case_submitter_id || !fileType || !newFileName) {
      res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      return;
    }

    const multiOmicsRecord = await MultiOmics.findOne({ case_submitter_id });
    if (!multiOmicsRecord) {
      res.status(404).json({ message: "Không tìm thấy hồ sơ MultiOmics" });
      return;
    }

    const fileIndex = multiOmicsRecord.files.findIndex((f) => f.file_type === fileType);
    if (fileIndex === -1) {
      res.status(404).json({ message: "Không tìm thấy file để đổi tên" });
      return;
    }

    // Đổi tên file
    multiOmicsRecord.files[fileIndex].file_name = newFileName;

    await multiOmicsRecord.save();

    res.status(200).json({
      message: "File renamed successfully",
      file: multiOmicsRecord.files[fileIndex],
    });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({ message: "Lỗi khi đổi tên file" });
  }
};

export default {
  getFilesForRecord,
  uploadFile,
  deleteFile,
  renameFile,
};