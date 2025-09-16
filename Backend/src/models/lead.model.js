import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const leadSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    lead_value: {
      type: Number,
    },
    last_activity_at: {
      type: Date,
    },
    is_qualified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

leadSchema.plugin(mongoosePaginate);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;