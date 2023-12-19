import mongoose from "mongoose";
const { Schema } = mongoose;
let customerPortalSettings = new Schema(
    {
    shop:String,
    values: Object,
    cancellation: String,
    options: Object,
  },
  { timestamps: true }
);
let cPortalSettings = mongoose.model("customer_portal", customerPortalSettings);
export default cPortalSettings;
