import mongoose from "mongoose";
const { Schema } = mongoose;
let order = new Schema(
    {
      shop:String,
        orderId: String,
        status:Boolean

  },
  { timestamps: true }
);
let orderOnly = mongoose.model("order_details_id", order);
export default orderOnly;
