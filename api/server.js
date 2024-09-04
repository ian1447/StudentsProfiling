// npm packages
import "dotenv/config.js";
import express from "express";
import logger from "morgan";
import cors from "cors";
import formData from "express-form-data";

import { User } from './models/user.js'; // Adjust the import path as needed
import { Profile } from './models/profile.js'; // Adjust the import path as needed

// connect to MongoDB with mongoose
import "./config/database.js";

// import routes
import { router as profilesRouter } from "./routes/profiles.js";
import { router as authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { studentsRouter } from "./routes/students.js";
import { yearsectionsRouter } from "./routes/yearsection.js"
import { enrolledsubjectsRouter } from "./routes/enrolledsubjects.js"
import { gradesRouter } from "./routes/grades.js";

// create the express app
const app = express();

// basic middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(formData.parse());

// mount imported routes
app.use("/api/profiles", profilesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/students", studentsRouter);
app.use("/api/yearsections", yearsectionsRouter);
app.use("/api/enrolledsubjects", enrolledsubjectsRouter);
app.use("/api/grades", gradesRouter);

// handle 404 errors
app.use(function (req, res, next) {
  res.status(404).json({ err: "Not found" });
});

// handle all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ err: err.message });
});

export { app };
