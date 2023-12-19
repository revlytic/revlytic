import mongoose from "mongoose";
const { Schema } = mongoose;
let subscriptionDetailsSchema = new Schema(
  {
    shop: String,
    subscription_draft_id:String,
    subscription_id:String,
    createdBy:{
      type: String,
      enum: ['merchant', 'customer']
    },
    customer_details:Object,
    shipping_address:Object,
    billing_address:Object,
    subscription_details:Object,
    product_details:Array,
    payment_details:Object,
    delivery_price:String,
    status:String,
    nextBillingDate:Date,
  },
  { timestamps: true }
);
let subscriptionDetailsModal = mongoose.model("subscription_details", subscriptionDetailsSchema);
export default subscriptionDetailsModal;
