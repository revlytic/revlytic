import mongoose from "mongoose";
const { Schema } = mongoose;
let dunningSchema = new Schema(
  {
    shop: String,
    dunningNoticeType:String,
    enableDunningNotices:Boolean,
    enablePaymentAttempt:Boolean ,
    statementsInput:String,
    showDueDate:Boolean,
    showOverdueInvoices:Boolean,
    attemptNum:String,
    attemptList:Array
  },
  { timestamps: true }
);
let dunningModal = mongoose.model("dunning", dunningSchema);
export default dunningModal;