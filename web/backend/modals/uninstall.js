import mongoose from "mongoose";
const { Schema } = mongoose;
let UninstalledShopInfo = new Schema(
  {
    shop: String,
    installDate: Date,
    uninstallDate: Date,
    themeType: String,
  },
  { timestamps: true }
);
let uninstallModal = mongoose.model("Uninstall", UninstalledShopInfo);
export default uninstallModal;
