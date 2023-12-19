import mongoose from "mongoose";
const { Schema } = mongoose;

let productsBundleSchema = new Schema(
  {
        shop: String,
        bundleDetails: Object,
        products:Array
  
  },
  { timestamps: true }
);
let productBundleModal = mongoose.model("productBundle", productsBundleSchema);
export default productBundleModal;
