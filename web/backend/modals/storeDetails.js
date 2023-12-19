import mongoose from "mongoose";
const { Schema } = mongoose;
let storeInfoSchema = new Schema(
  {
    shop: String,
    store_name: String,
    store_owner: String,
    store_email: String,
    currency: String,
    currency_code: String,
    timezone: String,
    themeType: String,
    themeId: String,
  },
  { timestamps: true }
);
let StoreSchemaModal = mongoose.model("store_details", storeInfoSchema);
export default StoreSchemaModal;
