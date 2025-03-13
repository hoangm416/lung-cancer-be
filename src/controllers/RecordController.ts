import { Request, Response } from "express";
import Record from "../models/record";

const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().lean();
    res.json({ data: records });
  } catch (error: any) {
    console.error("Lỗi lấy dữ liệu:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
}

export default {
    getRecords,
}