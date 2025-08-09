import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, VideoOff, Mic, MicOff, MessageCircle, FileText, Phone, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatBot from '../components/ChatBot' // Assuming ChatBot is a component that handles chat interactions

const SessionRoom = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessionDetails()
  }, [sessionId])

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      const data = await response.json()

      if (response.ok) {
        setSession(data.session)
      } else {
        toast.error('Session not found')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error('Failed to load session')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleEndSession = () => {
    toast.success('Session ended successfully')
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Session with {session?.mentorName || session?.studentName}
          </h1>
          <p className="text-gray-400 text-sm">{session?.subject}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-green-400 text-sm">● Live</span>
          <button
            onClick={handleEndSession}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Video Container */}
          <div className="h-full bg-gray-800 flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Video call will be implemented here</p>
                <p className="text-gray-500 text-sm mt-2">
                  This would integrate with WebRTC for real video calling
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 rounded-full px-6 py-3">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full transition-all ${
                  isAudioOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-all ${
                  isVideoOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-all"
              >
                <MessageCircle size={20} />
              </button>

              <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-all">
                <FileText size={20} />
              </button>

              <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-all">
                <Settings size={20} />
              </button>

              <button
                onClick={handleEndSession}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              >
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Session Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map(message => (
                  <div key={message.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{message.sender}</span>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-gold text-gray-900 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionRoom
