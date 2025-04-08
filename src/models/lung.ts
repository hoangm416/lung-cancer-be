import mongoose from "mongoose";

const lungSchema = new mongoose.Schema({
  case_submitter_id: { type: String, required: true, unique: true }, // Định danh duy nhất
  files: {
    cnv: { type: String, required: true }, // Đường dẫn hoặc URL file CNV
    dna_methylation: { type: String, required: true }, // Đường dẫn hoặc URL file DNA Methylation
    miRNA: { type: String, required: true }, // Đường dẫn hoặc URL file miRNA
    gene_expression: { type: String, required: true }, // Đường dẫn hoặc URL file Gene Expression
  },
});

const Lung = mongoose.model("Lung", lungSchema);
export default Lung;