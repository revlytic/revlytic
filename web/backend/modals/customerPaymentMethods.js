import mongoose from "mongoose";
const { Schema } = mongoose;
let customer_pay = new Schema(
  {
    shop: String,
    customer_id: String,
    payment_method_token: String,
    payment_instrument_type: String,
    payment_instrument_value: String,
  },
  { timestamps: true }
);
let customers_pay = mongoose.model("subscription_customers", customer_pay);
export default customers_pay;
