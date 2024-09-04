import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

function decodeUserFromToken(req, res, next) {
  let token = req.get("Authorization") || req.query.token || req.body.token || req.get("x-auth-token");
  if (token) {
    jwt.verify(token.replace("Bearer ", ""), process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

function checkAuth(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

async function tokenIsValid(req, res) {
  try {
    const user = await User.findById(req.user).populate("profile");
    if (user) {
      if (user.student_id) {
        await user.populate("student_id");
      }
    }
    if (!user) return res.json(false);
    
    
    res.json({
      user: {
        id: user._id,
        displayName: user.profile.name,
        email: user.email,
        photo: user.profile.photo,
        role: user.role,
        student_id: user.student_id,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export { decodeUserFromToken, checkAuth, tokenIsValid };
