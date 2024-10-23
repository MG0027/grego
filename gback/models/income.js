const mongoose = require("mongoose"); // Import mongoose
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const incomeSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    incomes: [
      {
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        hide: {type: Boolean, default: false}
      },
    ],

   

  },
  { timestamps: true }
);

const Income = model("income", incomeSchema);

module.exports = Income;
