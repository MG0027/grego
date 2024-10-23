const mongoose = require("mongoose"); // Import mongoose
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const expenseSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expenses: [
      {
        amount: { type: Number,required: true  },
        description: { type: String, required:true },
        hide: {type: Boolean, default: false}
      },
    ],

   

  },
  { timestamps: true }
);

const Expense = model("expense", expenseSchema);

module.exports = Expense;
