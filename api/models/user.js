import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 7;
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }, // Default value
  student_id: { type: Schema.Types.ObjectId, ref: 'students'},
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
}, {
  timestamps: true,
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  
  try {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (tryPassword) {
  return await bcrypt.compare(tryPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export { User };
