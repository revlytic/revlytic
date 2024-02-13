import mongoose from "mongoose";
const { Schema } = mongoose;
let billing = new Schema(
  {
    shop:String,
    plan:String,
    price:Number,
    interval:String,
    charge_id:String,
    next_billing:String,
    activated_on:String

  },
  { timestamps: true }
);
let billingModal= mongoose.model("billing", billing);
export default billingModal;
