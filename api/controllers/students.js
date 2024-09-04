import { Student } from "../models/students.js";
import { User } from "../models/user.js";

export async function getStudents(req, res) {
  try {
    const students = await Student.find({}).populate("year_section");
    res.json(students);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.error(err.message);
  }
}

export async function createStudent(req, res) {
  try {
    const {
        id_number,
        first_name,
        last_name,
        middle_name,
        email,
        year_section,
    } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const student = new Student({
        id_number,
        first_name,
        last_name,
        middle_name,
        email,
        year_section,
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function updateStudents(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("year_section");
    if (!student)
      return res.status(404).json({ message: "Student not found" });
    res.json(student);
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

export async function deleteStudent(req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
