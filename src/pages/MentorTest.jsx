import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MentorTest = () => {
  const navigate = useNavigate();
  
  // Get state and actions from the Zustand store
  const { user, getTestQuestions, submitTest, isLoading } = useAuthStore();

  // Component's local state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTest = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await submitTest(answers);
      
      if (response.passed) {
        toast.success(`Congratulations! You passed with ${response.score.toFixed(1)}%`);
        navigate('/profile-completion');
      } else {
        toast.error(`Test failed. Score: ${response.score.toFixed(1)}%. Your account cannot be approved at this time.`);
        navigate('/'); // Redirect home on failure
      }
    } catch (err) {
      // The error message from the store is more specific (e.g., IP blocked)
      const storeError = useAuthStore.getState().error;
      toast.error(storeError || 'An unexpected error occurred.');
      navigate('/'); // Redirect home on error
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, navigate, submitTest, isSubmitting]);

  // Effect to fetch questions based on the user's domain from the store
  useEffect(() => {
    if (user?.role !== 'mentor' || !user?.domain) {
      toast.error("Invalid access. Please select a domain first.");
      navigate('/domain-selection');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getTestQuestions(user.domain);
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
        } else {
          toast.error("Could not load test questions for this domain.");
          navigate('/domain-selection');
        }
      } catch (err) {
        // Error is handled globally in the store, just need to redirect
        navigate('/domain-selection');
      }
    };

    fetchQuestions();
  }, [user, navigate, getTestQuestions]);

  // Effect for the countdown timer
  useEffect(() => {
    if (!testStarted || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeLeft]);

  // Effect to auto-submit when the timer runs out
  useEffect(() => {
    if (timeLeft === 0 && testStarted) {
      toast.warn("Time's up! Submitting your test automatically.");
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, handleSubmitTest]);


  // --- Event Handlers ---
  const handleStartTest = () => setTestStarted(true);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render Logic ---
  if (isLoading && questions.length === 0) {
    return <LoadingSpinner />;
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (!testStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full">
          <div className="gradient-card p-8 rounded-2xl shadow-2xl text-center">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Qualification Test</h2>
            <p className="text-gray-300 mb-6">
              Domain: <span className="text-yellow-400 font-medium capitalize">{user?.domain}</span>
            </p>
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Test Instructions:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{questions.length} multiple-choice questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>15 minutes time limit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Minimum 60% score required to pass</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Failing the test will block you from reapplying.</span>
                </li>
              </ul>
            </div>
            <button onClick={handleStartTest} className="btn-primary text-lg px-12 py-4">
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="gradient-card p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Qualification Test</h2>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-gray-300 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
        </div>

        {questions.length > 0 && questions[currentQuestion] && (
          <div className="gradient-card p-8 rounded-2xl mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">{questions[currentQuestion].questionText}</h3>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(questions[currentQuestion]._id, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${answers[questions[currentQuestion]._id] === index ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-gray-600 bg-gray-800/50 text-white hover:border-gray-500'}`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <p className="text-gray-300 text-sm">Answered: {Object.keys(answers).length} / {questions.length}</p>
          {currentQuestion === questions.length - 1 ? (
            <button onClick={handleSubmitTest} disabled={isLoading || isSubmitting} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              {isLoading || isSubmitting ? (<><div className="spinner mr-2"></div>Submitting...</>) : ('Submit Test')}
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorTest;