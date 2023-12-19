import mongoose from "mongoose";
const { Schema } = mongoose;
let emailTemplatesSchema = new Schema(
  {
    shop:String,
   settings:Object,
   configuration:Object
  },
  { timestamps: true }
);
let emailTemplatesModal = mongoose.model("email_templates", emailTemplatesSchema);
export default emailTemplatesModal;
