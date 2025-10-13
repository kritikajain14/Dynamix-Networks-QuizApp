import Question from '../models/Question.js';

// Shuffle helper
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Fallback question generator
export const generateFallbackQuestions = (category, difficulty, count = 1) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Sample ${difficulty} ${category} question ${i + 1}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option B',
      category,
      difficulty,
      explanation: 'This is a fallback question.',
      isAIGenerated: false,
      isFallback: true
    });
  }
  return questions;
};

