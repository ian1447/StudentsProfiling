import { Yearsection } from "../models/yearsection.js";
import { User } from "../models/user.js";

export async function getYearSection(req, res) {
  try {
    const yearsections = await Yearsection.find({});
    res.json(yearsections);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function createYearSection(req, res) {
  try {
    const {
       year,
       section
    } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const yearsection = new Yearsection({
        year,
        section,
    });
    await yearsection.save();
    res.status(201).json(yearsection);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function updateYearSection(req, res) {
  try {
    const yearsection = await Yearsection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!yearsection)
      return res.status(404).json({ message: "Year and Section not found" });
    res.json(yearsection);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function deleteYearSection(req, res) {
  try {
    const yearsection = await Yearsection.findByIdAndDelete(req.params.id);
    if (!yearsection)
      return res.status(404).json({ message: "Year and Section not found" });
    res.json({ message: "Year and Section deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
