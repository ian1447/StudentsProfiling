import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    id_number: { type: String, required: true, unique: true },
    first_name:  { type: String, required: true},
    last_name:  { type: String, required: true},
    middle_name:  { type: String, required: true},
    year_section: { type: Schema.Types.ObjectId, ref: "yearsections" },
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

studentSchema.pre("save", async function (next) {
  const student = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const Student = mongoose.model("students", studentSchema);

export { Student };
