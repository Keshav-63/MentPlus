import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { Code, Brain, Shield, Database, Box, CheckCircle } from 'lucide-react';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const SubjectSelection = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const { saveStudentSubjects, isLoading } = useAuthStore();
  const navigate = useNavigate();
  // The useAuth() hook is no longer needed as we'll interact with the store directly.

  const subjects = [
    {
      id: 'programming',
      title: 'Programming Basics',
      description: 'C, C++, Java fundamentals',
      icon: <Code className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'aiml',
      title: 'AI/ML with Python',
      description: 'Machine Learning, Data Science',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Security fundamentals, Ethical hacking',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Core DSA concepts and problem solving',
      icon: <Database className="w-8 h-8" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Technology',
      description: 'Cryptocurrency, Smart contracts',
      icon: <Box className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleContinue = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    // setLoading(true);

    try {
      // Call the action from the store to make the API request
      await saveStudentSubjects(selectedSubjects);
      
      toast.success('Preferences saved successfully!');
      navigate('/student-dashboard');
    } catch (error) {
      const storeError = useAuthStore.getState().error;
      toast.error(storeError || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 pt-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the subjects you want to learn. You can always add more later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectToggle(subject.id)}
              className={`relative gradient-card p-6 rounded-2xl h-full cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedSubjects.includes(subject.id)
                  ? 'ring-2 ring-yellow-400'
                  : 'ring-2 ring-transparent'
              }`}
            >
              {selectedSubjects.includes(subject.id) && (
                <div className="absolute top-4 right-4 bg-navy-900 rounded-full">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                </div>
              )}
              <div className={`w-16 h-16 bg-gradient-to-r ${subject.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                {subject.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{subject.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{subject.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              Selected: {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
            </p>
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {selectedSubjects.map(subjectId => {
                  const subject = subjects.find(s => s.id === subjectId);
                  return (
                    <span key={subjectId} className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
                      {subject.title}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={isLoading || selectedSubjects.length === 0}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <div className="spinner mr-2"></div>
                Saving...
              </>
            ) : (
              'Continue to Dashboard'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;