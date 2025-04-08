import { Request, Response } from "express";
import Lung from "../models/lung";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Thêm file lên Cloudinary và lưu thông tin vào DB
export const uploadLungFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType } = req.body;

    if (!req.file || !case_submitter_id || !fileType) {
      res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      return;
    }

    // Xác định kiểu của fileType
    const validFileTypes = ["cnv", "dna_methylation", "miRNA", "gene_expression"] as const;
    if (!validFileTypes.includes(fileType)) {
      res.status(400).json({ message: "Loại file không hợp lệ" });
      return;
    }

    const file = req.file;
    const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "raw", // Hỗ trợ upload file không phải ảnh
    });

    const lungRecord = await Lung.findOne({ case_submitter_id });
    if (!lungRecord) {
      res.status(404).json({ message: "Không tìm thấy hồ sơ phổi" });
      return;
    }

    // Đảm bảo lungRecord.files tồn tại
    if (!lungRecord.files) {
      lungRecord.files = {
        cnv: "",
        dna_methylation: "",
        miRNA: "",
        gene_expression: "",
      };
    }

    // Gán giá trị cho trường tương ứng
    lungRecord.files[fileType as keyof typeof lungRecord.files] = uploadResponse.secure_url;
    await lungRecord.save();

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Lỗi khi upload file" });
  }
};

// Tải xuống file từ Cloudinary
export const downloadLungFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType } = req.params;

    const validFileTypes = ["cnv", "dna_methylation", "miRNA", "gene_expression"] as const;
    if (!validFileTypes.includes(fileType as typeof validFileTypes[number])) {
      res.status(400).json({ message: "Loại file không hợp lệ" });
      return;
    }

    const lungRecord = await Lung.findOne({ case_submitter_id });
    if (!lungRecord || !lungRecord.files || !lungRecord.files[fileType as keyof typeof lungRecord.files]) {
      res.status(404).json({ message: "Không tìm thấy file" });
      return;
    }

    res.status(200).json({ fileUrl: lungRecord.files[fileType as keyof typeof lungRecord.files] });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Lỗi khi tải file" });
  }
};

// Sửa file trên Cloudinary
export const updateLungFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType } = req.body;

    if (!req.file || !case_submitter_id || !fileType) {
      res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      return;
    }

    const validFileTypes = ["cnv", "dna_methylation", "miRNA", "gene_expression"] as const;
    if (!validFileTypes.includes(fileType)) {
      res.status(400).json({ message: "Loại file không hợp lệ" });
      return;
    }

    const lungRecord = await Lung.findOne({ case_submitter_id });
    if (!lungRecord || !lungRecord.files || !lungRecord.files[fileType as keyof typeof lungRecord.files]) {
      res.status(404).json({ message: "Không tìm thấy file để sửa" });
      return;
    }

    const oldFileUrl = lungRecord.files[fileType as keyof typeof lungRecord.files];
    const publicId = oldFileUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });
    }

    const file = req.file;
    const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "raw",
    });

    lungRecord.files[fileType as keyof typeof lungRecord.files] = uploadResponse.secure_url;
    await lungRecord.save();

    res.status(200).json({
      message: "File updated successfully",
      fileUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Lỗi khi sửa file" });
  }
};

// Xóa file trên Cloudinary và DB
export const deleteLungFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_submitter_id, fileType } = req.params;

    const validFileTypes = ["cnv", "dna_methylation", "miRNA", "gene_expression"] as const;
    if (!validFileTypes.includes(fileType as typeof validFileTypes[number])) {
      res.status(400).json({ message: "Loại file không hợp lệ" });
      return;
    }

    const lungRecord = await Lung.findOne({ case_submitter_id });
    if (!lungRecord || !lungRecord.files || !lungRecord.files[fileType as keyof typeof lungRecord.files]) {
      res.status(404).json({ message: "Không tìm thấy file để xóa" });
      return;
    }

    const fileUrl = lungRecord.files[fileType as keyof typeof lungRecord.files];
    const publicId = fileUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });
    }

    lungRecord.files[fileType as keyof typeof lungRecord.files] = "";
    await lungRecord.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Lỗi khi xóa file" });
  }
};

export default {
  uploadLungFile,
  downloadLungFile,
  updateLungFile,
  deleteLungFile,
};