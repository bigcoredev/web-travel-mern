import mongoose from 'mongoose'
const reviewSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
  },
  comment: {
      type: String,
  },
  liked: {
    type: Boolean, default: false,
  },
  noticed: {
    type: Boolean, default: false,
  },
}, {
  timestamps: true,
});

const postModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title:  { type: String },
    details:  { type: String },
    location:  { type: String },
    isPublic: { type: Boolean, default: false },
    rating:  { type: Number },
    image:  { type: String },
    reviews: [reviewSchema],
    noticed: [ {type: mongoose.Schema.Types.ObjectId, ref: "User"} ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postModel);

export default Post;
