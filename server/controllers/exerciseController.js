const Exercise = require('../models/Exercise');

const getExercises = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Exercise.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exercise.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExercise = async (req, res) => {
  try {
    const { name, category, targetMuscles, notes } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: 'Exercise name and category are required.',
      });
    }

    const exercise = await Exercise.create({
      user: req.user._id,
      name: String(name).trim(),
      category: String(category).trim(),
      targetMuscles: Array.isArray(targetMuscles)
        ? targetMuscles.map((muscle) => String(muscle).trim()).filter(Boolean)
        : [],
      notes: notes ? String(notes).trim() : '',
    });

    return res.status(201).json({ data: exercise });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found.' });
    }

    return res.status(200).json({ data: exercise });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { name, category, targetMuscles, notes } = req.body;

    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found.' });
    }

    if (name !== undefined && String(name).trim()) {
      exercise.name = String(name).trim();
    }

    if (category !== undefined && String(category).trim()) {
      exercise.category = String(category).trim();
    }

    if (targetMuscles !== undefined) {
      exercise.targetMuscles = Array.isArray(targetMuscles)
        ? targetMuscles.map((muscle) => String(muscle).trim()).filter(Boolean)
        : [];
    }

    if (notes !== undefined) {
      exercise.notes = String(notes).trim();
    }

    const updatedExercise = await exercise.save();
    return res.status(200).json({ data: updatedExercise });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found.' });
    }

    return res.status(200).json({
      message: 'Exercise deleted successfully.',
      data: exercise,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
