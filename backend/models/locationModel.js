import mongoose from 'mongoose'

const locationModel = mongoose.Schema(
  {
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationModel);

export default Location;
