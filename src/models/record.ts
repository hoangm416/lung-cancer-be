const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  case_id: { type: String, required: true },
  case_submitter_id: { type: String, required: true },
  project_id: { type: String, required: true },
  patient_name: { type: String },
  age_at_index: { type: Number },
  days_to_birth: { type: String },
  days_to_death: { type: String },
  ethnicity: { type: String },
  gender: { type: String },
  race: { type: String },
  vital_status: { type: String },
  year_of_birth: { type: String },
  year_of_death: { type: String },
  age_at_diagnosis: { type: String },
  ajcc_pathologic_m: { type: String },
  ajcc_pathologic_n: { type: String },
  ajcc_pathologic_stage: { type: String },
  ajcc_pathologic_t: { type: String },
  ajcc_staging_system_edition: { type: String },
  classification_of_tumor: { type: String },
  days_to_diagnosis: { type: Number },
  days_to_last_follow_up: { type: Number },
  icd_10_code: { type: String },
  last_known_disease_status: { type: String },
  morphology: { type: String },
  primary_diagnosis: { type: String },
  prior_malignancy: { type: String },
  prior_treatment: { type: String },
  progression_or_recurrence: { type: String },
  site_of_resection_or_biopsy: { type: String },
  synchronous_malignancy: { type: String },
  tissue_or_organ_of_origin: { type: String },
  tumor_grade: { type: String },
  year_of_diagnosis: { type: String },
  treatment_or_therapy: { type: String },
  treatment_type: { type: String }
});

const Record = mongoose.model('Record', recordSchema);
export default Record;
