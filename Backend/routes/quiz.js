import express from 'express';
import { protect } from '../middleware/auth.js';
import { shuffleArray } from '../utils/quizUtils.js';
import { questionsDB } from '../data/questions.js';

const router = express.Router();

/**
 * @route POST /api/quiz/questions
 * @desc Get quiz filtered by topics and difficulties
 * @body { topics: [], difficulties: [], count }
 */
router.post('/questions', protect, (req, res) => {
  const { 
    topics = ['Web Development', 'Mathematics', 'Science', 'History', 'General Knowledge'],
    difficulties = ['easy', 'medium', 'hard'],
    count = 15
  } = req.body;

  let filtered = questionsDB.filter(q => 
    topics.includes(q.category) && difficulties.includes(q.difficulty)
  );

  // Shuffle and limit count
  filtered = shuffleArray(filtered).slice(0, count);

  // Shuffle options for each question
  const finalQuiz = filtered.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));

  res.json({
    questions: finalQuiz,
    metadata: {
      totalQuestions: finalQuiz.length,
      topicsCovered: [...new Set(finalQuiz.map(q => q.category))],
      difficultiesCovered: [...new Set(finalQuiz.map(q => q.difficulty))],
    }
  });
});

/**
 * @route GET /api/quiz/metadata
 * @desc Get all topics and difficulties
 */
router.get('/metadata', (req, res) => {
  const topics = [...new Set(questionsDB.map(q => q.category))];
  const difficulties = [...new Set(questionsDB.map(q => q.difficulty))];
  res.json({ topics, difficulties });
});

/**
 * @route POST /api/quiz/submit
 * @desc Save quiz result and return analytics
 * @body { score, totalQuestions, topicDistribution, difficultyBreakdown, timeTaken }
 */
router.post('/submit', protect, async (req, res) => {
  try {
    const { score, totalQuestions, topicDistribution, difficultyBreakdown, timeTaken } = req.body;

    if (score === undefined || totalQuestions === undefined) {
      return res.status(400).json({ message: 'Score and totalQuestions are required.' });
    }

    // Simple accuracy calculation
    const accuracy = ((score / totalQuestions) * 100).toFixed(2);

    // Placeholder for saving (you can replace with MongoDB model)
    const result = {
      user: req.user?.id || 'guest',
      score,
      totalQuestions,
      accuracy,
      topicDistribution,
      difficultyBreakdown,
      timeTaken,
      date: new Date().toISOString()
    };

    console.log('🧾 Quiz submitted:', result);

    res.status(200).json({
      message: 'Quiz results recorded successfully.',
      result
    });
  } catch (error) {
    console.error('❌ Quiz submission error:', error);
    res.status(500).json({ message: 'Failed to record quiz result', error: error.message });
  }
});

export default router;
