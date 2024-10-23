const mongoose = require("mongoose"); // Import mongoose
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const CalendarSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    events: [
      {
        event: { type: String, required: true },
        date: { type: Date, required: true },
        completed: {type: Boolean, default: false}
      },
    ],
  },
  { timestamps: true }
);

const Calendar = model("calendar", CalendarSchema);

module.exports = Calendar;
