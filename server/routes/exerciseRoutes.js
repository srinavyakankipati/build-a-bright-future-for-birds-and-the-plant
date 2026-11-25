const express = require('express');
const {
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getExercises).post(createExercise);
router.route('/:id').get(getExerciseById).put(updateExercise).delete(deleteExercise);

module.exports = router;
