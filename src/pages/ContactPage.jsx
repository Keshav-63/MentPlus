// import React, { useState } from 'react'
// import { toast } from 'react-toastify'
// import { useAuthStore } from '../store/authStore';
// import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users } from 'lucide-react'

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   })
//     // Get the action and state from the Zustand store
//   const { submitContactForm, isLoading } = useAuthStore();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
//       handleSubmit(e)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await submitContactForm(formData);
//       toast.success(response.message);
//       // Reset the form on successful submission
//       setFormData({ name: '', email: '', subject: '', message: '' });
//     } catch (error) {
//       const storeError = useAuthStore.getState().error;
//       toast.error(storeError || 'Failed to send message. Please try again.');
//     }
//   };

//   const contactInfo = [
//     {
//       icon: <Mail className="w-6 h-6" />,
//       title: 'Email Us',
//       content: 'support@mentorhub.com',
//       description: 'Send us an email anytime'
//     },
//     {
//       icon: <Phone className="w-6 h-6" />,
//       title: 'Call Us',
//       content: '+1 (555) 123-4567',
//       description: 'Mon-Fri from 8am to 5pm'
//     },
//     {
//       icon: <MapPin className="w-6 h-6" />,
//       title: 'Visit Us',
//       content: '123 Learning Street, Education City, EC 12345',
//       description: 'Come say hello at our office'
//     }
//   ]

//   const faqs = [
//     {
//       question: 'How do I book a session with a mentor?',
//       answer: 'Simply browse our mentors, select the one that fits your needs, and click on either "1-on-1" or "Group" session. The mentor will review and approve your request.'
//     },
//     {
//       question: 'What payment methods do you accept?',
//       answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure Razorpay integration.'
//     },
//     {
//       question: 'Can I cancel or reschedule a session?',
//       answer: 'Yes, you can cancel or reschedule sessions up to 24 hours before the scheduled time without any penalty.'
//     },
//     {
//       question: 'How do I become a mentor?',
//       answer: 'Sign up as a mentor, select your domain of expertise, pass our qualification test with 60% or above, and complete your profile to start mentoring.'
//     }
//   ]

//   return (
//     <div className="min-h-screen py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Get in <span className="text-yellow-400">Touch</span>
//           </h1>
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//             Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12 mb-16">
//           {/* Contact Form */}
//           <div className="gradient-card p-8 rounded-2xl">
//             <div className="flex items-center mb-6">
//               <MessageCircle className="w-6 h-6 text-yellow-400 mr-3" />
//               <h2 className="text-2xl font-semibold text-white">Send us a Message</h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Form fields remain the same */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
//                   <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter your name" required />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
//                   <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter your email" required />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
//                 <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="What's this about?" required />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
//                 <textarea name="message" value={formData.message} onChange={handleInputChange} rows="6" className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none" placeholder="Tell us more about your inquiry..." required></textarea>
//               </div>
//               <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
//                 {isLoading ? (
//                   <><div className="spinner mr-2"></div>Sending...</>
//                 ) : (
//                   <><Send className="w-5 h-5 mr-2" />Send Message</>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-8">
//             <div>
//               <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
//               <div className="space-y-6">
//                 {contactInfo.map((info, index) => (
//                   <div key={index} className="gradient-card p-6 rounded-xl hover:scale-105 transition-transform">
//                     <div className="flex items-start">
//                       <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
//                         <div className="text-yellow-400">
//                           {info.icon}
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-semibold text-white mb-1">
//                           {info.title}
//                         </h3>
//                         <p className="text-yellow-400 font-medium mb-1">
//                           {info.content}
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           {info.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Business Hours */}
//             <div className="gradient-card p-6 rounded-xl">
//               <div className="flex items-center mb-4">
//                 <Clock className="w-6 h-6 text-yellow-400 mr-3" />
//                 <h3 className="text-lg font-semibold text-white">Business Hours</h3>
//               </div>
//               <div className="space-y-2 text-gray-300">
//                 <div className="flex justify-between">
//                   <span>Monday - Friday</span>
//                   <span>8:00 AM - 8:00 PM</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Saturday</span>
//                   <span>9:00 AM - 6:00 PM</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Sunday</span>
//                   <span>10:00 AM - 4:00 PM</span>
//                 </div>
//               </div>
//             </div>

//             {/* Response Time */}
//             <div className="gradient-card p-6 rounded-xl">
//               <div className="flex items-center mb-4">
//                 <Users className="w-6 h-6 text-yellow-400 mr-3" />
//                 <h3 className="text-lg font-semibold text-white">Response Time</h3>
//               </div>
//               <p className="text-gray-300">
//                 We typically respond to all inquiries within 24 hours during business days. 
//                 For urgent matters, please call us directly.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mb-16">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-white mb-4">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-gray-300 text-lg">
//               Quick answers to questions you may have
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {faqs.map((faq, index) => (
//               <div key={index} className="gradient-card p-6 rounded-xl">
//                 <h3 className="text-lg font-semibold text-white mb-3">
//                   {faq.question}
//                 </h3>
//                 <p className="text-gray-300 leading-relaxed">
//                   {faq.answer}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA Section */}
//         <div className="text-center gradient-card p-12 rounded-2xl">
//           <h2 className="text-3xl font-bold text-white mb-4">
//             Ready to Start Learning?
//           </h2>
//           <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
//             Join thousands of students who are already learning from expert mentors. 
//             Start your journey today!
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="btn-primary text-lg px-8 py-3">
//               Browse Mentors
//             </button>
//             <button className="btn-secondary text-lg px-8 py-3">
//               Become a Mentor
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ContactPage


















import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '../store/authStore';
import ChatBot from '../components/ChatBot';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Users,
  Github,
  Linkedin
} from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  // Get the action and state from the Zustand store
  const { submitContactForm, isLoading } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitContactForm(formData);
      toast.success(response.message);
      // Reset the form on successful submission
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const storeError = useAuthStore.getState().error;
      toast.error(storeError || 'Failed to send message. Please try again.');
    }
  };

  // Developer data - photos expected in public/ (e.g. public/shreeyansh.jpg)
  const developers = [
    {
      name: 'Shreeyansh Singh',
      role: 'Full Stack Developer',
      photo: './Shreeyansh.png',
      email: 'Shreeyanshsingh07@gmail.com',
      github: 'https://github.com/ShreeyanshSingh-Raghuvanshi',
      linkedin: 'https://www.linkedin.com/in/shreeyansh-singh-858ab633b',
      bio: 'Passionate full stack developer focusing on scalable web apps, clean UI and robust backend architecture. Experienced with MERN stack, testing and CI/CD.',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind']
    },
    {
      name: 'Keshav Suthar',
      role: 'Full Stack Developer',
      photo: './Keshav.png',
      email: 'keshavdv241@gmail.com',
      github: 'https://github.com/keshav-63',
      linkedin: 'https://www.linkedin.com/in/keshav-suthar',
      bio: 'Full stack engineer skilled in building performant web platforms, APIs and devops automation. Enjoys refining developer experience and performant frontends.',
      stack: ['React', 'Next.js', 'Node.js', 'Postgres', 'Docker']
    }
  ]

  const faqs = [
    {
      question: 'How do I book a session with a mentor?',
      answer: 'Simply browse our mentors, select the one that fits your needs, and click on either "1-on-1" or "Group" session. The mentor will review and approve your request.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure Razorpay integration.'
    },
    {
      question: 'Can I cancel or reschedule a session?',
      answer: 'Yes, you can cancel or reschedule sessions up to 24 hours before the scheduled time without any penalty.'
    },
    {
      question: 'How do I become a mentor?',
      answer: 'Sign up as a mentor, select your domain of expertise, pass our qualification test with 60% or above, and complete your profile to start mentoring.'
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <ChatBot />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="gradient-card p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter your email" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="What's this about?" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows="6" className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none" placeholder="Tell us more about your inquiry..." required></textarea>
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading ? (
                  <><div className="spinner mr-2"></div>Sending...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" />Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* Developers Section (replaces Contact Information & Business Hours) */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Meet the Developers</h2>

              <div className="grid gap-6">
                {developers.map((dev, idx) => (
                  <article key={idx} className="bg-gradient-to-br from-white/3 to-white/2 border border-white/6 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.02] transition-transform">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-36 h-36 rounded-full overflow-hidden shadow-xl ring-1 ring-white/10">
                        <img
                          src={dev.photo}
                          alt={dev.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{dev.name}</h3>
                          <p className="text-sm text-yellow-400 font-medium">{dev.role}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mt-3 leading-relaxed">
                        {dev.bio}
                      </p>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {dev.stack.map((tech, tIdx) => (
                          <span key={tIdx} className="text-sm bg-white/6 text-gray-100 px-3 py-1 rounded-full inline-flex items-center">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap gap-3 mt-5 items-center">
                        <a href={`mailto:${dev.email}`} className="inline-flex items-center gap-2 bg-yellow-400 text-navy-900 px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-95 transition">
                          <Mail className="w-4 h-4" /> Email
                        </a>

                        <a href={dev.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
                          <Github className="w-4 h-4" /> GitHub
                        </a>

                        <a href={dev.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Optional small team note */}
            <div className="gradient-card p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">About the Team</h3>
              </div>
              <p className="text-gray-300">
                Shreeyansh and Keshav are full stack developers who built this platform end-to-end — frontend, backend and deployment. If you'd like to collaborate, hire, or know more about the stack, reach out via email or their profiles above.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 text-lg">
              Quick answers to questions you may have
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="gradient-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center gradient-card p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning from expert mentors. 
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Browse Mentors
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Become a Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage