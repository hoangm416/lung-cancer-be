import mongoose from 'mongoose';
import slugify from 'slugify';


const researchSchema = new mongoose.Schema({
  research_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: false },
  date: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  detail: { type: String, required: true },
});

researchSchema.pre('save', function (this: any, next: () => void) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});


const Research = mongoose.model("Research", researchSchema);
export default Research;
