import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('selection');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [availableDifficulties, setAvailableDifficulties] = useState([]);
  const [quizConfig, setQuizConfig] = useState({
    topics: ['General Knowledge', 'Mathematics', 'Web Development', 'Science', 'History'],
    difficulties: ['easy', 'medium', 'hard'],
    questionCount: 15
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  // ------------------ AUTH CHECK & FETCH METADATA ------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to take a quiz');
      navigate('/login');
      return;
    }
    fetchMetadata();
  }, [navigate]);

  const fetchMetadata = async () => {
    try {
      const res = await axios.get('/api/quiz/metadata');
      setAvailableTopics(res.data?.topics || quizConfig.topics);
      setAvailableDifficulties(res.data?.difficulties || quizConfig.difficulties);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      toast.error('Unable to fetch quiz topics.');
      // fallback to defaults
      setAvailableTopics(quizConfig.topics);
      setAvailableDifficulties(quizConfig.difficulties);
    }
  };

  // ------------------ QUIZ START ------------------
  const startQuiz = async () => {
    if (quizConfig.topics.length === 0 || quizConfig.difficulties.length === 0) {
      toast.error('Please select at least one topic and difficulty');
      return;
    }

    setLoading(true);
    setTimeStarted(Date.now());
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = {
        topics: quizConfig.topics,
        difficulties: quizConfig.difficulties,
        count: quizConfig.questionCount
      };
      const res = await axios.post('/api/quiz/questions', body, config);
      setQuestions(res.data.questions || []);
      setStep('quiz');
      toast.success(`Loaded ${res.data.questions?.length || 0} questions!`);
    } catch (err) {
      console.error('Quiz start error:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  // ------------------ HANDLE ANSWERS ------------------
  const handleAnswer = (option) => {
    if (selectedOptions[currentQuestion]) return; // prevent re-answering

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = option;
    setSelectedOptions(newSelectedOptions);

    const currentQ = questions[currentQuestion];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('✅ Correct!', { duration: 1000 });
    } else {
      toast.error(`❌ Correct: ${currentQ.correctAnswer}`, { duration: 1000 });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setTimeTaken(Math.floor((Date.now() - timeStarted) / 1000));
        submitQuiz();
      }
    }, 1000);
  };

  // ------------------ SUBMIT QUIZ ------------------
  const submitQuiz = async () => {
    setTimeTaken(Math.floor((Date.now() - timeStarted) / 1000)); // ensure accurate timing
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const topicDistribution = {};
      const difficultyBreakdown = {};
      questions.forEach(q => {
        topicDistribution[q.category] = (topicDistribution[q.category] || 0) + 1;
        difficultyBreakdown[q.difficulty] = (difficultyBreakdown[q.difficulty] || 0) + 1;
      });

      await axios.post(
        '/api/quiz/submit',
        { score, totalQuestions: questions.length, topicDistribution, difficultyBreakdown, timeTaken },
        config
      );

      setStep('results');
      toast.success('🎉 Quiz Completed!');
    } catch (err) {
      console.error('Submit quiz error:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  // ------------------ TOGGLE CONFIG ------------------
  const toggleTopic = (topic) =>
    setQuizConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));

  const toggleDifficulty = (difficulty) =>
    setQuizConfig(prev => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter(d => d !== difficulty)
        : [...prev.difficulties, difficulty]
    }));

  const restartQuiz = () => {
    setStep('selection');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOptions([]);
    setTimeTaken(0);
  };

  // ------------------ RENDER SCREENS ------------------
  switch (step) {
    // ------------------ SELECTION SCREEN ------------------
    case 'selection':
      return (
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Create Your Quiz</h1>
            <p className="text-lg text-gray-600">Mix and match topics & difficulties for your custom challenge!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topics */}
            <div className="card">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Select Topics</h2>
              <div className="grid grid-cols-2 gap-4">
                {availableTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                      quizConfig.topics.includes(topic)
                        ? getTopicColor(topic, true)
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {getTopicEmoji(topic)} {topic}
                    {quizConfig.topics.includes(topic) && <div className="text-sm mt-2 text-green-600">✓ Selected</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulties */}
            <div className="card">
              <h2 className="text-2xl font-bold text-green-600 mb-6">Select Difficulties</h2>
              <div className="space-y-4">
                {availableDifficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    className={`w-full p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                      quizConfig.difficulties.includes(difficulty)
                        ? getDifficultyColor(difficulty, true)
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {getDifficultyEmoji(difficulty)} {difficulty}
                  </button>
                ))}
              </div>

              {/* Question Count */}
              <div className="mt-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Number of Questions: {quizConfig.questionCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={quizConfig.questionCount}
                  onChange={(e) =>
                    setQuizConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center mt-10">
            <button
              onClick={startQuiz}
              disabled={loading || quizConfig.topics.length === 0 || quizConfig.difficulties.length === 0}
              className="btn-primary text-lg px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Preparing Quiz...' : `Start Quiz (${quizConfig.questionCount} questions)`}
            </button>
          </div>
        </div>
      );

    // ------------------ QUIZ SCREEN ------------------
    case 'quiz':
      if (!questions.length) return null;
      const q = questions[currentQuestion];
      const progress = ((currentQuestion + 1) / questions.length) * 100;

      return (
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTopicColor(q.category)}`}>
                  {getTopicEmoji(q.category)} {q.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(q.difficulty)}`}>
                  {getDifficultyEmoji(q.difficulty)} {q.difficulty.toUpperCase()}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {currentQuestion + 1} / {questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-3 mb-8">
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${getGradientColors(progress)})` }}
              ></div>
            </div>

            {/* Question */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">{q.question}</h2>
              <div className="space-y-4">
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedOptions[currentQuestion]}
                    className="w-full p-4 border-2 rounded-xl hover:border-blue-300 disabled:opacity-50 transition-all"
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center mr-3 rounded-full bg-blue-100 text-blue-600">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Score + Manual Submit */}
            <div className="text-center mt-6">
              <p className="inline-block bg-blue-50 px-4 py-2 rounded-full font-semibold">
                Score: {score} / {questions.length}
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={submitQuiz}
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg rounded-xl"
              >
                {loading ? 'Submitting...' : 'Submit Quiz Now'}
              </button>
            </div>
          </div>
        </div>
      );

    // ------------------ RESULTS SCREEN ------------------
    case 'results':
      const percent = Math.round((score / questions.length) * 100);
      return (
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">
              {percent >= 80 ? 'Excellent! 🎉' : percent >= 60 ? 'Good Job! 👍' : 'Keep Practicing 💪'}
            </h2>
            <p className="text-gray-600 mb-6">You scored {score}/{questions.length} ({percent}%)</p>

            <p className="text-gray-500 mb-8">Time: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s</p>

            <button onClick={restartQuiz} className="btn-primary w-full text-lg py-3 mb-3 rounded-xl">
              Take Another Quiz
            </button>
            <button onClick={() => navigate('/quiz')} className="btn-secondary w-full text-lg py-3 rounded-xl">
              View Detailed Analytics
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// ------------------ HELPERS ------------------
const getTopicColor = (topic, selected = false) => {
  const c = {
    'Mathematics': 'border-blue-500 bg-blue-50 text-blue-600',
    'Web Development': 'border-purple-500 bg-purple-50 text-purple-600',
    'General Knowledge': 'border-green-500 bg-green-50 text-green-600',
    'Science': 'border-red-500 bg-red-50 text-red-600',
    'History': 'border-yellow-500 bg-yellow-50 text-yellow-600'
  };
  return selected ? c[topic] : 'border-gray-300 text-gray-600';
};

const getDifficultyColor = (d, selected = false) => {
  const c = {
    easy: 'border-green-500 bg-green-50 text-green-600',
    medium: 'border-yellow-500 bg-yellow-50 text-yellow-600',
    hard: 'border-red-500 bg-red-50 text-red-600'
  };
  return selected ? c[d] : 'border-gray-300 text-gray-600';
};

const getTopicEmoji = (t) => ({
  'Mathematics': '🧮',
  'Web Development': '💻',
  'General Knowledge': '🌍',
  'Science': '🔬',
  'History': '📜'
}[t] || '❓');

const getDifficultyEmoji = (d) => ({ easy: '😊', medium: '😐', hard: '😰' }[d] || '❓');

const getGradientColors = (p) => (p < 33 ? '#ef4444, #f97316' : p < 66 ? '#f97316, #eab308' : '#eab308, #22c55e');

export default Quiz;
