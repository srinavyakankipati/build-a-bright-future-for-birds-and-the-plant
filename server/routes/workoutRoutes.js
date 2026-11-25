const express = require('express');
const {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getWorkouts).post(createWorkout);
router.route('/:id').get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
