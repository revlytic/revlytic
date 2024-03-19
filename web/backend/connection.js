import mongoose from "mongoose";
const dbURI = "mongodb://127.0.0.1:27017/subscription";
function db() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true },)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
}
export default db;
