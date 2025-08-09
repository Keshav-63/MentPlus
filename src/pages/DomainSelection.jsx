import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { Code, Brain, Shield, Database, Box, ArrowRight } from 'lucide-react';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const DomainSelection = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const navigate = useNavigate();

  // Get the CORRECT action and loading state from the store
  const { saveMentorDomain, isLoading } = useAuthStore();

  const domains = [
    {
      id: 'programming',
      title: 'Programming Instructor',
      description: 'Teach C, C++, Java fundamentals',
      icon: <Code className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      subjects: ['C Programming', 'C++', 'Java Basics']
    },
    {
      id: 'aiml',
      title: 'AI/ML Teacher',
      description: 'Python, Machine Learning, Data Science',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      subjects: ['Python', 'Machine Learning', 'Data Science']
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Expert',
      description: 'Security fundamentals, Ethical hacking',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      subjects: ['Network Security', 'Ethical Hacking', 'Cryptography']
    },
    {
      id: 'dsa',
      title: 'DSA Instructor',
      description: 'Data Structures & Algorithms (Core Level)',
      icon: <Database className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      subjects: ['Data Structures', 'Algorithms', 'Problem Solving']
    },
    {
      id: 'blockchain',
      title: 'Blockchain Expert',
      description: 'Cryptocurrency, Smart contracts, DeFi',
      icon: <Box className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600',
      subjects: ['Blockchain Basics', 'Smart Contracts', 'Cryptocurrency']
    }
  ];

  const handleDomainSelect = (domainId) => {
    setSelectedDomain(domainId);
  };

  const handleContinue = async () => {
    if (!selectedDomain) {
      toast.error('Please select a domain to continue');
      return;
    }

    try {
      // CORRECTED: Call the action to save the domain to the backend
      await saveMentorDomain(selectedDomain);
      
      toast.success('Domain saved! Proceeding to assessment...');
      navigate('/mentor-test');
    } catch (error) {
      // The error from the store is more specific
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
            Choose Your Expertise Domain
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the domain where you want to mentor students. You'll need to pass a qualification test.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => handleDomainSelect(domain.id)}
              className={`gradient-card p-6 rounded-2xl h-full cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedDomain === domain.id
                  ? 'ring-2 ring-yellow-400 scale-105'
                  : 'ring-2 ring-transparent'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${domain.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                {domain.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {domain.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {domain.description}
              </p>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium">Key Topics:</p>
                {domains.find(d => d.id === domain.id)?.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-block text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded mr-1 mb-1"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          {selectedDomain && (
            <div className="mb-6">
              <p className="text-gray-300 mb-2">Selected Domain:</p>
              <span className="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-lg font-medium">
                {domains.find(d => d.id === selectedDomain)?.title}
              </span>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={isLoading || !selectedDomain}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <div className="spinner mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                Take Qualification Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-400 mt-4">
            You need to score 60% or above to qualify as a mentor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DomainSelection;