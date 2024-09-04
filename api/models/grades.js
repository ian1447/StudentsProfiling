import mongoose from "mongoose";
const Schema = mongoose.Schema;

const grades = new Schema(
  {
    year_section: { type: Schema.Types.ObjectId, ref: "yearsections" },
    student_id: { type: Schema.Types.ObjectId, ref: "students" },
    subject: { type: String, required: true},
    first: { type: String, required: true},
    second: { type: String, required: true},
    third: { type: String, required: true},
    fourth: { type: String, required: true},
  },
  {
    timestamps: true,
  }
);

// appointmentSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password;
//     return ret;
//   }
// });

grades.pre("save", async function (next) {
  const grades = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const Grades = mongoose.model("grades", grades);

export { Grades };
