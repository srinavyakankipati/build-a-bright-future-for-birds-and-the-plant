const Workout = require('../models/Workout');

const getWorkouts = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Workout.find({ user: req.user._id })
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Workout.countDocuments({ user: req.user._id }),
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

const createWorkout = async (req, res) => {
  try {
    const { title, notes, date, durationMinutes, exercises } = req.body;

    if (!title || !durationMinutes) {
      return res.status(400).json({
        message: 'Workout title and durationMinutes are required.',
      });
    }

    const workoutExercises = Array.isArray(exercises)
      ? exercises.map((exercise, index) => ({
          exerciseId: exercise.exerciseId || undefined,
          name: exercise.name ? String(exercise.name).trim() : `Exercise ${index + 1}`,
          sets: Number(exercise.sets) || 0,
          reps: Number(exercise.reps) || 0,
          weight: Number(exercise.weight) || 0,
          durationMinutes: Number(exercise.durationMinutes) || 0,
        }))
      : [];

    const workout = await Workout.create({
      user: req.user._id,
      title: String(title).trim(),
      notes: notes ? String(notes).trim() : '',
      date: date ? new Date(date) : new Date(),
      durationMinutes: Number(durationMinutes),
      exercises: workoutExercises,
    });

    return res.status(201).json({ data: workout });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    return res.status(200).json({ data: workout });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    const { title, notes, date, durationMinutes, exercises } = req.body;

    if (title !== undefined) workout.title = String(title).trim();
    if (notes !== undefined) workout.notes = String(notes).trim();
    if (date !== undefined) workout.date = new Date(date);
    if (durationMinutes !== undefined) workout.durationMinutes = Number(durationMinutes);
    if (exercises !== undefined) {
      workout.exercises = exercises.map((exercise, index) => ({
        exerciseId: exercise.exerciseId || undefined,
        name: exercise.name ? String(exercise.name).trim() : `Exercise ${index + 1}`,
        sets: Number(exercise.sets) || 0,
        reps: Number(exercise.reps) || 0,
        weight: Number(exercise.weight) || 0,
        durationMinutes: Number(exercise.durationMinutes) || 0,
      }));
    }

    const updatedWorkout = await workout.save();
    return res.status(200).json({ data: updatedWorkout });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    return res.status(200).json({
      message: 'Workout deleted successfully.',
      data: workout,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};
