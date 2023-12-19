import mongoose from "mongoose";
const { Schema } = mongoose;
let customer = new Schema(
  {
    shop: String,
    customer_id: String,
    customer_name: String,
    customer_email: String,
  },
  { timestamps: true }
);
let sub_customers = mongoose.model("subscription_customers", customer);
export default sub_customers;
