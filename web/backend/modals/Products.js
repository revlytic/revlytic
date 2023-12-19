import mongoose from "mongoose";
const { Schema } = mongoose;

let productsSchema = new Schema(
  {
    shop: String,
    products_data: [
      {
        product_id: String,
        product_image: String,
        product_name: String,
        hasOnlyDefaultVariant: Boolean,
        variants: Array,
        subscription_type: String,
      },
    ],
  },
  { timestamps: true }
);
let productsModal = mongoose.model("products", productsSchema);
export default productsModal;
