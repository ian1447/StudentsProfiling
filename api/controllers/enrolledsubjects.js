import { EnrolledSubjects} from "../models/enrolledsubjects.js"
import { User } from "../models/user.js";

export async function getEnrolledSubjects(req, res) {
  try {
    const enrolledsubjects = await EnrolledSubjects.find({}).populate("year_section").populate("student_id");
    res.json(enrolledsubjects);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.error(err.message);
  }
}

export async function createEnrolledSubjects(req, res) {
  try {
    const {
        year_section,
        student_id,
        is_enrolled,
        is_passed,
    } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const enrolledsubjects = new EnrolledSubjects({
        year_section,
        student_id,
        is_enrolled,
        is_passed,
    });
    await enrolledsubjects.save();
    res.status(201).json(enrolledsubjects);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function updateEnrolledSubjects(req, res) {
  try {
    const enrolledsubjects = await EnrolledSubjects.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("year_section");
    if (!enrolledsubjects)
      return res.status(404).json({ message: "Enrolled subjects not found" });
    res.json(enrolledsubjects);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

// export async function approvedeclineAppointment(req, res) {
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { $set: { status: req.body.status } },
//       { new: true }
//     );

//     console.log(appointment);

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });
//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//     console.log(err.message);
//   }
// }

export async function deleteEnrolledSubjects(req, res) {
  try {
    const enrolledsubjects = await EnrolledSubjects.findByIdAndDelete(req.params.id);
    if (!enrolledsubjects)
      return res.status(404).json({ message: "Enrolled Subjects not found" });
    res.json({ message: "Enrolled Subjects deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
