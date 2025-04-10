const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  detail: { type: String, required: true },
  date: { type: String},
});

const Research = mongoose.model("Research", researchSchema);
export default Research;