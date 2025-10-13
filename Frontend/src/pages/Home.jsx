import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Welcome to QuizWhiz!
          </h1>
          <p className="text-xl text-gray-950 mb-10 leading-relaxed">
            Test your knowledge, challenge your friends with our fun and engaging quizzes! 
            <span className="block mt-2 text-lg"> THINK 🤔.       TAP 👆.       TRIUMPH 😤.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/quiz" className="btn-primary text-lg px-8 py-4 ">
              🚀 Start Quiz Now
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-4 ">
              ✨ Create Free Account
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card border-blue-200 transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Multiple Categories</h3>
            <p className="text-gray-600">Choose from various topics like Web Dev, Math, General Knowledge and more!</p>
          </div>
          
          <div className="card border-pink-200 transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-500 text-2xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">Brain Twisters</h3>
            <p className="text-gray-600">A fun and engaging way to learn through quizzes.</p>
          </div>
          
          <div className="card border-green-200 transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Mixed Topics</h3>
            <p className="text-gray-600">Mix topics, choose your difficulty, and take customized quizzes anytime.</p>
          </div>
        </div>

        {/* Additional CTAs */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to boost your knowledge?</h2>
          <p className="text-gray-600 mb-6">Join thousands of learners who are improving their skills every day!</p>
          <div className="space-x-4">
            <Link to="/register" className="btn-accent text-lg px-8">
              🎁 Sign Up Free
            </Link>
            <Link to="/login" className="btn-primary text-lg px-8">
              🔑 Already a Member?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;