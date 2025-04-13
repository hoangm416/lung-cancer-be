import { Request, Response } from "express";
import Record from "../models/record";
import mongoose from "mongoose";

// Lấy danh sách Record
const getRecord = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().lean();
    res.json({ data: records });
  } catch (error: any) {
    console.error("Lỗi lấy dữ liệu:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Thêm Record mới
const addRecord = async (req: Request, res: Response) => {
  try {
    const {
      case_id,
      case_submitter_id,
      project_id,
      patient_name,
      age_at_index,
      days_to_birth,
      days_to_death,
      ethnicity,
      gender,
      race,
      vital_status,
      year_of_birth,
      year_of_death,
      age_at_diagnosis,
      ajcc_pathologic_m,
      ajcc_pathologic_n,
      ajcc_pathologic_stage,
      ajcc_pathologic_t,
      ajcc_staging_system_edition,
      classification_of_tumor,
      days_to_diagnosis,
      days_to_last_follow_up,
      icd_10_code,
      last_known_disease_status,
      morphology,
      primary_diagnosis,
      prior_malignancy,
      prior_treatment,
      progression_or_recurrence,
      site_of_resection_or_biopsy,
      synchronous_malignancy,
      tissue_or_organ_of_origin,
      tumor_grade,
      year_of_diagnosis,
      treatment_or_therapy,
      treatment_type,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!case_id || !case_submitter_id || !project_id) {
      res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      return;
    }

    const newRecord = new Record({
      case_id,
      case_submitter_id,
      project_id,
      patient_name,
      age_at_index,
      days_to_birth,
      days_to_death,
      ethnicity,
      gender,
      race,
      vital_status,
      year_of_birth,
      year_of_death,
      age_at_diagnosis,
      ajcc_pathologic_m,
      ajcc_pathologic_n,
      ajcc_pathologic_stage,
      ajcc_pathologic_t,
      ajcc_staging_system_edition,
      classification_of_tumor,
      days_to_diagnosis,
      days_to_last_follow_up,
      icd_10_code,
      last_known_disease_status,
      morphology,
      primary_diagnosis,
      prior_malignancy,
      prior_treatment,
      progression_or_recurrence,
      site_of_resection_or_biopsy,
      synchronous_malignancy,
      tissue_or_organ_of_origin,
      tumor_grade,
      year_of_diagnosis,
      treatment_or_therapy,
      treatment_type,
    });

    await newRecord.save();
    res.status(201).json({ message: "Record đã được thêm thành công", record: newRecord });
  } catch (error: any) {
    console.error("Lỗi thêm Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

const editRecord = async (req: Request, res: Response) => {
  try {
    const { id: case_submitter_id } = req.params; // Lấy case_id từ params
    const updateData = req.body;

    // Tìm và cập nhật Record dựa trên case_id
    const record = await Record.findOneAndUpdate({ case_submitter_id }, updateData, { new: true });
    if (!record) {
      res.status(404).json({ message: "Không tìm thấy Record" });
      return;
    }

    res.status(200).json({ message: "Record đã được cập nhật thành công", record });
  } catch (error: any) {
    console.error("Lỗi sửa Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Xóa Record
const removeRecord = async (req: Request, res: Response) => {
  try {
    const { id: case_submitter_id } = req.params; // Lấy case_id từ params

    // Tìm và xóa Record dựa trên case_id
    const record = await Record.findOneAndDelete({ case_submitter_id });
    if (!record) {
      res.status(404).json({ message: "Không tìm thấy Record để xóa" });
      return;
    }

    res.status(200).json({ message: "Record đã được xóa thành công" });
  } catch (error: any) {
    console.error("Lỗi xóa Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

export default {
  getRecord,
  addRecord,
  editRecord,
  removeRecord,
};