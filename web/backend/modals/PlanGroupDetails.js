import mongoose from "mongoose";
const { Schema } = mongoose;
let planSchema = new Schema(
  {
    shop: String,
    product_details: Array,
    plan_group_name: String,
    plan_group_id: String,
    plans:Array,

  },
  { timestamps: true }
);
let planModal = mongoose.model("plan_group_detail", planSchema);
export default planModal;
