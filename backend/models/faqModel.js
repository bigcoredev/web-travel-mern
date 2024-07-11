import mongoose from 'mongoose'

const faqModel = mongoose.Schema(
  {
    no: { type: Number },
    question:  { type: String },
    answer:  { type: String },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqModel);

export default Faq;
