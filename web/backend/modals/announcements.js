import mongoose from "mongoose";
const { Schema } = mongoose;
let announcementsSchema = new Schema(
  {
    title: String,
    image: String,

    description: String,

    buttonUrl: String,
    buttonText: String,
  },
  { timestamps: true }
);
let announcementsModal = mongoose.model("announcements", announcementsSchema);
export default announcementsModal;
