import mongoose from "mongoose";
const Schema = mongoose.Schema;

const enrolledsubjects = new Schema(
  {
    year_section: { type: Schema.Types.ObjectId, ref: "yearsections" },
    student_id: { type: Schema.Types.ObjectId, ref: "students" },
    is_enrolled: { type: String, required: true, default: "Y"},
    is_passed: {type: String, required: true, default: "N"}
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

enrolledsubjects.pre("save", async function (next) {
  const enrolledsubject = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const EnrolledSubjects = mongoose.model("enrolledsubjects", enrolledsubjects);

export { EnrolledSubjects };
