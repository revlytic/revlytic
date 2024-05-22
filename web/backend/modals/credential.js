import mongoose from "mongoose";
const { Schema } = mongoose;
let shopInfo = new Schema(
  {
    shop: String,
    accessToken: String,
    setUpGuide:Boolean
    // themeType:String
  },
  { timestamps: true }
);
let shopModal = mongoose.model("install", shopInfo);
export default shopModal;
