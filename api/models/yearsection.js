import mongoose from "mongoose";
const Schema = mongoose.Schema;

const yearsectionSchema = new Schema(
  {
    year: { type: String, required: true},
    section:  { type: String, required: true},
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

yearsectionSchema.pre("save", async function (next) {
  const yearsection = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const Yearsection = mongoose.model("yearsections", yearsectionSchema);

export { Yearsection };
