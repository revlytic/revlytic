import mongoose from "mongoose";
const { Schema } = mongoose;
let widgetSettingsSchema = new Schema(
  {
    shop: String,
    widgetSettings:Object 
  },
  { timestamps: true }
);
let widgetSettingsModal = mongoose.model("widget_settings", widgetSettingsSchema);
export default widgetSettingsModal;
