const mongoose = require("mongoose"); // Import mongoose
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const taskSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [
      {
        task: { type: String, required: true },
        duedatetime: { type: Date, required: true },
        completed: {type: Boolean, default: false}
      },
    ],
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

module.exports = Task;
