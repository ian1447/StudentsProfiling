import { User } from '../models/user.js';
import { Profile } from '../models/profile.js';

// Get all users
export async function getUsers(req, res) {
  try {
    const users = await User.find({}).populate('profile');
    for (let user of users) {
      if (user.student_id) {
        await user.populate('student_id');
      }
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
    
  }
}

// Get a single user by ID
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).populate('profile');
    for (let user of users) {
      if (user.student_id) {
        await user.populate('student_id')
      }
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

// Create a new user
export async function createUser(req, res) {
  try {
    const { firstname,middlename, lastname, email, password, role, student_id} = req.body;
    if (!password) return res.status(400).json({ err: 'Password is required' });
    
    const user = new User({ firstname,middlename, lastname, email, password, role, student_id });
    await user.save();
    const profile = new Profile({ user: user._id });
    await profile.save();
    user.profile = profile._id;
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

// Update a user
export async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('profile').populate('student_id');
    // for (let user of users) {
    //   if (user.student_id) {
    //     await user.populate('student_id')
    //   }
    // }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
    
  }
}

// Delete a user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
