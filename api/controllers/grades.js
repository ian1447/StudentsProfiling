import { Grades } from "../models/grades.js";
import { User } from "../models/user.js";

export async function getGrades(req, res) {
  try {
    const grades = await Grades.find({}).populate("year_section").populate("student_id");
    res.json(grades);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.error(err.message);
  }
}

export async function createGrades(req, res) {
  try {
    const {
      year_section,
      student_id,
      subject,
      grades = [],
      gradesid
    } = req.body;

    const [first = 0, second = 0, third = 0, fourth = 0] = grades;

    const gradesDocument = new Grades({
      year_section,
      student_id,
      subject,
      first,
      second,
      third,
      fourth,
      gradesid
    });

    await gradesDocument.save();

    res.status(201).json(gradesDocument);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
}

export async function updateGrades(req, res) {
  try {
    const {
      year_section,
      student_id,
      subject,
      grades = [],
      gradesid
    } = req.body;

    // Map grades array to individual variables
    const [first = 0, second = 0, third = 0, fourth = 0] = grades;

    // Find the document by ID and update it with the new data
    const gradesDocument = await Grades.findByIdAndUpdate(
      req.params.id,
      {
        year_section,
        student_id,
        subject,
        first,
        second,
        third,
        fourth,
        gradesid
      },
      { new: true }
    ).populate("year_section").populate("student_id");
    if (!gradesDocument)
      return res.status(404).json({ message: "Grades not found" });
    res.json(gradesDocument);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function deleteGrades(req, res) {
  try {
    const grades = await Grades.findByIdAndDelete(req.params.id);
    if (!grades)
      return res.status(404).json({ message: "Grades not found" });
    res.json({ message: "Grades deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
