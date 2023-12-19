import mongoose from "mongoose";
const { Schema } = mongoose;
let planProductsSchema = new Schema(
  {
    shop: String,
    plan_group_id: String,
    product_id: String,
    varient_id:Array
  },
  { timestamps: true }
);
let planProductModal = mongoose.model("plan_group_products", planProductsSchema);
export default planProductModal;