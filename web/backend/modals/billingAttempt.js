import mongoose from "mongoose";
const { Schema } = mongoose;
let billing_Attempts = new Schema(
  {
    shop:String,
    status: String,
    order_id: String,
    order_no: String,
    contract_id: String,
    billing_attempt_date: Date,
    billing_response_date:Date,
    renewal_date: Date,
    billing_attempt_id: String,
    contract_products: Array,
    total_amount: Number,
    currency:String,
    idempotencyKey:String,
    numberOfAttempts:Number
  },
  { timestamps: true }
);
let billing_Attempt = mongoose.model("billing_Attempts", billing_Attempts);
export default billing_Attempt;
