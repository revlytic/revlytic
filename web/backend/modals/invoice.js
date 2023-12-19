import mongoose from "mongoose";
const { Schema } = mongoose;
let invoice = new Schema(
  {
    shop: String,
    components: Array,
    invoice_details: Object,
  },
  { timestamps: true }
);
let invoice_all_details = mongoose.model("invoice_detail", invoice);
export default invoice_all_details;
