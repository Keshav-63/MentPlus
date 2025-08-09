// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { MessageCircle, Video, CreditCard, FileText, Star, Users, Clock, Award, ArrowRight, Play, CheckCircle } from 'lucide-react'

// const HomePage = () => {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     setIsVisible(true)
//   }, [])

//   const features = [
//     {
//       icon: <MessageCircle className="w-8 h-8" />,
//       title: "Live Chat",
//       description: "Instant messaging with mentors for quick doubt resolution"
//     },
//     {
//       icon: <Video className="w-8 h-8" />,
//       title: "Video Calls",
//       description: "Face-to-face learning sessions with experienced mentors"
//     },
//     {
//       icon: <CreditCard className="w-8 h-8" />,
//       title: "Secure Payments",
//       description: "Safe and secure transactions via Razorpay integration"
//     },
//     {
//       icon: <FileText className="w-8 h-8" />,
//       title: "Document Vault",
//       description: "Secure sharing of study materials and resources"
//     }
//   ]

//   const stats = [
//     { number: "1000+", label: "Active Students" },
//     { number: "200+", label: "Expert Mentors" },
//     { number: "5000+", label: "Sessions Completed" },
//     { number: "4.9", label: "Average Rating" }
//   ]

//   const domains = [
//     "Programming (C, C++, Java)",
//     "AI/ML with Python",
//     "Cybersecurity",
//     "Data Structures & Algorithms",
//     "Blockchain Technology"
//   ]

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         {/* Background Animation */}
//         <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-gray-900 to-navy-800">
//           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
//           <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className={`transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
//               Learn from the
//               <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> Best</span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Connect with expert mentors for personalized learning experiences. 
//               Master programming, AI/ML, cybersecurity, and more through one-on-one or group sessions.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link to="/signup" className="btn-primary text-lg px-10 py-4">
//                 Start Learning Today
//                 <ArrowRight className="ml-2 w-5 h-5" />
//               </Link>
//               <button className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors text-lg">
//                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400/20 transition-colors">
//                   <Play className="w-5 h-5 ml-1" />
//                 </div>
//                 <span>Watch Demo</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-20 bg-gradient-to-r from-navy-900 to-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
//                 <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
//                   {stat.number}
//                 </div>
//                 <div className="text-gray-300 text-lg">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gradient-to-b from-gray-900 to-navy-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//               Powerful Features for
//               <span className="text-yellow-400"> Effective Learning</span>
//             </h2>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//               Everything you need for a comprehensive learning experience, all in one platform
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <div 
//                 key={index} 
//                 className="gradient-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group animate-fadeInUp"
//                 style={{animationDelay: `${index * 0.1}s`}}
//               >
//                 <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
//                 <p className="text-gray-300 leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Domains Section */}
//       <section className="py-20 bg-gradient-to-r from-navy-900 to-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//               Master In-Demand
//               <span className="text-yellow-400"> Skills</span>
//             </h2>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//               Learn from industry experts in the most sought-after technology domains
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {domains.map((domain, index) => (
//               <div 
//                 key={index}
//                 className="glass p-6 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 group animate-fadeInLeft"
//                 style={{animationDelay: `${index * 0.1}s`}}
//               >
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
//                   <span className="text-white font-medium text-lg">{domain}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <Link to="/explore" className="btn-secondary text-lg px-8 py-4">
//               Explore All Mentors
//               <ArrowRight className="ml-2 w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-br from-yellow-400 to-yellow-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="animate-fadeInUp">
//             <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
//               Ready to Start Your Learning Journey?
//             </h2>
//             <p className="text-xl text-navy-800 mb-8 max-w-2xl mx-auto">
//               Join thousands of students who have transformed their careers with personalized mentorship
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link to="/signup" className="bg-navy-900 text-white font-semibold py-4 px-10 rounded-lg hover:bg-navy-800 transition-colors text-lg">
//                 Get Started Now
//               </Link>
//               <Link to="/explore" className="border-2 border-navy-900 text-navy-900 font-semibold py-4 px-10 rounded-lg hover:bg-navy-900 hover:text-white transition-colors text-lg">
//                 Browse Mentors
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default HomePage






















import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Video,
  CreditCard,
  FileText,
  Star,
  Users,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Target,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import ChatBot from '../components/ChatBot'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Instant messaging with mentors for quick doubt resolution and continuous support"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "HD Video Calls",
      description: "Crystal clear face-to-face learning sessions with screen sharing capabilities"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Safe and secure transactions via Razorpay with multiple payment options"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Vault",
      description: "Secure sharing of study materials, assignments, and progress tracking"
    }
  ]

  const stats = [
    { number: "2,500+", label: "Active Students", icon: <Users className="w-6 h-6" /> },
    { number: "350+", label: "Expert Mentors", icon: <Award className="w-6 h-6" /> },
    { number: "15,000+", label: "Sessions Completed", icon: <BookOpen className="w-6 h-6" /> },
    { number: "4.9", label: "Average Rating", icon: <Star className="w-6 h-6" /> }
  ]

  const domains = [
    {
      title: "Programming Fundamentals",
      description: "Master C, C++, Java with hands-on projects",
      icon: "💻",
    },
    {
      title: "AI/ML with Python",
      description: "Deep learning, neural networks, and data science",
      icon: "🤖",
    },
    {
      title: "Cybersecurity",
      description: "Ethical hacking, penetration testing, security",
      icon: "🛡️",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Core DSA concepts and competitive programming",
      icon: "📊",
    },
    {
      title: "Blockchain Technology",
      description: "Smart contracts, DeFi, and cryptocurrency",
      icon: "⛓️",
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "MentorHub transformed my coding journey. The personalized guidance helped me land my dream job!",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "AI Researcher",
      content: "The AI/ML mentors here are exceptional. They made complex concepts easy to understand.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Cybersecurity Analyst",
      content: "Thanks to my mentor, I successfully transitioned into cybersecurity. Highly recommended!",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5
    }
  ]

  const benefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Learning",
      description: "Tailored curriculum based on your goals and skill level"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Track Progress",
      description: "Accelerate your learning with expert guidance and mentorship"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assured",
      description: "All mentors are vetted professionals with proven expertise"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Community",
      description: "Connect with learners and mentors from around the world"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-gray-900 to-navy-800 text-white">
      <ChatBot />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* <section className="hero-section"> */}
        {/* Animated Background Elements (subtle for dark theme) */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-yellow-400/10 text-yellow-300 font-medium rounded-full text-sm mb-4">
                🚀 Join 2,500+ Students Learning Today
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Master Skills with
              <span className="bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent block mt-2">Expert Mentors</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with industry mentors for personalized 1-on-1 guidance in programming, AI/ML, cybersecurity and more.
              Practical projects, secure payments and progress tracking — all in one place.
            </p>
            {/* <section className = "features-section"> */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-yellow-400 text-navy-900 font-semibold text-lg px-12 py-4 rounded-xl shadow-xl hover:scale-105 transform transition"
              >
                Start Learning Today
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>

              <button className="flex items-center space-x-3 text-gray-200 hover:text-yellow-400 transition-colors text-lg group">
                <div className="w-14 h-14 bg-white/6 rounded-full flex items-center justify-center hover:bg-yellow-400/10 transition-colors shadow-lg group-hover:scale-110 transform duration-300">
                  <Play className="w-6 h-6 ml-1 text-white" />
                </div>
                <span className="font-medium">Watch Success Stories</span>
              </button>
            </div>
            {/* </section> */}

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cyan-300" />
                <span className="font-medium">Verified Mentors</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-300" />
                <span className="font-medium">95% Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      {/* </section> */}
    </section>

      {/* Stats Section */ }
  <section className="py-16 bg-gradient-to-r from-navy-900/70 to-gray-900/70">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center animate-fadeInUp" style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-navy-900 shadow-lg">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stat.number}
            </div>
            <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Features Section */ }
  <section className="py-16 bg-gradient-to-b from-gray-900 to-navy-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Powerful Features for
          <span className="text-yellow-400"> Effective Learning</span>
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Everything you need for a comprehensive learning experience, all in one platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/2 border border-white/6 hover:scale-105 transition-transform duration-300 group"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Domains Section */ }
  <section className="py-16 bg-gradient-to-r from-navy-900/80 to-gray-900/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Master In-Demand
          <span className="text-yellow-400"> Technologies</span>
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Choose from our carefully curated domains taught by industry experts with real-world experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-white/3 hover:bg-yellow-400/6 transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{domain.icon}</div>
              <div>
                <h4 className="text-white font-semibold text-lg">{domain.title}</h4>
                <p className="text-gray-300 text-sm mt-1">{domain.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/explore" className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
          Explore All Mentors
          <ArrowRight className="ml-3 w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>

  {/* Benefits Section */ }
  <section className="py-16 bg-gradient-to-b from-gray-900 to-navy-900">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose <span className="text-yellow-400">MentorHub?</span></h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <div key={i} className="text-center p-6 rounded-lg bg-white/4 border border-white/6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-yellow-400 to-cyan-400 flex items-center justify-center text-navy-900 shadow">
              {b.icon}
            </div>
            <h4 className="text-white font-semibold mb-2">{b.title}</h4>
            <p className="text-gray-300 text-sm">{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Testimonials Section */ }
  <section className="py-16 bg-gradient-to-r from-navy-900/70 to-gray-900/70">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Success Stories from <span className="text-yellow-400">Our Students</span></h2>
        <p className="text-gray-300">Real outcomes, real people — see what our learners achieved.</p>
      </div>

      <div className="relative">
        <div className="bg-navy-800/70 border border-white/6 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-4">
            <img
              src={testimonials[currentTestimonial].avatar}
              alt={testimonials[currentTestimonial].name}
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div>
              <h4 className="text-lg font-semibold text-white">{testimonials[currentTestimonial].name}</h4>
              <p className="text-gray-300 text-sm">{testimonials[currentTestimonial].role}</p>
              <div className="flex mt-2">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-200 leading-relaxed italic">"{testimonials[currentTestimonial].content}"</p>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTestimonial(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentTestimonial ? 'bg-yellow-400' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* CTA Section */ }
  <section className="py-16 bg-gradient-to-br from-yellow-400 to-cyan-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="animate-fadeInUp">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Ready to Transform Your Career?</h2>
        <p className="text-navy-900/90 mb-6 max-w-2xl mx-auto">Join thousands of students who have already accelerated their learning journey with expert mentorship.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="bg-navy-900 text-white font-semibold py-3 px-10 rounded-lg hover:bg-navy-800 transition-colors text-lg">
            Get Started Now
          </Link>
          <Link to="/explore" className="border-2 border-navy-900 text-navy-900 font-semibold py-3 px-10 rounded-lg hover:bg-navy-900 hover:text-white transition-colors text-lg">
            Browse Mentors
          </Link>
        </div>
      </div>
    </div>
  </section>
    </div >
  )
}

export default HomePage

