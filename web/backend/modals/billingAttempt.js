import mongoose from "mongoose";
const { Schema } = mongoose;
let billing_Attempts = new Schema(
  {
    shop: String,
    status: String,
    order_id: String,
    order_no: String,
    contract_id: String,
    billing_attempt_date: Date,
    billing_response_date: Date,
    renewal_date: Date,
    billing_attempt_id: String,
    contract_products: Array,
    total_amount: Number,
    currency: String,
    idempotencyKey: String,
    numberOfAttempts: Number,
    lastEmailSentStatus: String,
    retriedAttemptStatus: String,
    attemptMode: String,
  },
  { timestamps: true }
);

billing_Attempts.index(
  {
    shop: 1,
    contract_id: 1,
    idempotencyKey: 1,
    status: 1,
  },
  { partialFilterExpression: { status: "pending" } }
);

billing_Attempts.index(
  {
    shop: 1,
    contract_id: 1,
    status: 1,
  },
  {
    partialFilterExpression: {
      $or: [{ status: "failed" }, { status: "retriedAfterFailure" }],
    },
  }
);

let billing_Attempt = mongoose.model("billing_Attempts", billing_Attempts);
export default billing_Attempt;
