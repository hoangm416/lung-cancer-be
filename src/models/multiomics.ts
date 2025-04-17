import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  file_type: { type: String, required: true }, // Loại file (e.g., "cnv", "dna_methylation", "miRNA", "gene_expression")
  file_url: { type: String, required: true },
  file_name: { type: String }, // Đường dẫn hoặc URL của file
  uploaded_at: { type: Date, default: Date.now }, // Thời gian upload file
});

const multiomicsSchema = new mongoose.Schema({
  case_submitter_id: { type: String, required: true, unique: true }, // Định danh duy nhất cho mẫu bệnh phẩm
  files: [fileSchema], // Danh sách các file liên quan đến mẫu bệnh phẩm
});

const MultiOmics = mongoose.model("MultiOmics", multiomicsSchema);
export default MultiOmics;