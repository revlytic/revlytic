import mongoose from "mongoose";
const { Schema } = mongoose;
let orderContract = new Schema(
    {
        shop:String,
        orderId: String,
        contractID:String,
        status:Boolean

  },
  { timestamps: true }
);
let orderContractDetails = mongoose.model("contract_details_id", orderContract);
export default orderContractDetails;