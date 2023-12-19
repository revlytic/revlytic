import mongoose from "mongoose";
const { Schema } = mongoose;
let shopInfo = new Schema(
  {
    shop: String,
    accessToken: String,
    // themeType:String
  },
  { timestamps: true }
);
let shopModal = mongoose.model("install", shopInfo);
export default shopModal;
