import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Profile } from '../models/profile.js';

function createJWT(user) {
  return jwt.sign({ user: user._id }, process.env.SECRET, { expiresIn: '24h' });
}

async function login(req, res) {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env');
    if (!process.env.CLOUDINARY_URL) throw new Error('no CLOUDINARY_URL in back-end .env');

    const user = await User.findOne({ email: req.body.email }).populate('profile');
    if (user?.student_id) {
      await user.populate('student_id');
    }
    console.log('User Result:', user);
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(req.body.password);
    
    if (!isMatch) throw new Error('Incorrect password');

    const token = createJWT(user);

    res.json({
      token,
      user
    });
  } catch (err) {
    handleAuthError(err, res);
  }
}

async function signup(req, res) {
  try {
    const { idNumber, firstName, middleName, lastName, schoolLevel, email, password } = req.body;

    console.log("Received data:", req.body); // Log the received data

    const newUser = new User({
      idNumber: idNumber,
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      school_level: schoolLevel, // Ensure this field exists in your schema
      email: email,
      password: password,
      username: idNumber, // Set username to ID number
      role: "user", // Default role
    });

    console.log("User object before save:", newUser); // Log the user object

    await newUser.save();
    const profile = new Profile({ user: newUser._id });
    await profile.save();
    newUser.profile = profile._id;
    await newUser.save();
    const token = createJWT(newUser);
    res.json({ token, user: { id: newUser._id, displayName: profile.name, email: newUser.email } });
  } catch (err) {
    console.error("Error during signup:", err); // Log the error
    res.status(400).json({ err: err.message });
  }
}


async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) throw new Error('Incorrect old password');

    user.password = req.body.newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    handleAuthError(err, res);
  }
}

function handleAuthError(err, res) {
  console.log(err);
  const { message } = err;
  if (message === 'User not found' || message === 'Incorrect password' || message === 'Incorrect old password') {
    res.status(401).json({ err: message });
  } else {
    res.status(500).json({ err: message });
  }
}

export { signup, login, changePassword };
