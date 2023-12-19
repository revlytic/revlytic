import mongoose from "mongoose";
const { Schema } = mongoose;
let storeFrontToken = new Schema(
  {
    shop: String,
    accessToken: String,
  },
  { timestamps: true }
);
let storeModal = mongoose.model("store_Front_Token", storeFrontToken);
export default storeModal;
