import mongoose from "mongoose";
const { Schema } = mongoose;
let checkout = new Schema(
  {
    shop: String,
    product_details: Array,
    plan_group_name: String,
    plan_group_id: String,
    plans: Object,
    customer: Array,
  },
  { timestamps: true }
);
let checkoutCustomerModal = mongoose.model("checkout_customer", checkout);
export default checkoutCustomerModal;
