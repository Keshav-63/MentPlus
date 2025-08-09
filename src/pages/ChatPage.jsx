import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { ZIM } from "zego-zim-web";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { Send } from "lucide-react";

const ChatPage = () => {
  const { user, getChatConnections, generateZimToken } = useAuthStore();

  const [connections, setConnections] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [allMessages, setAllMessages] = useState({}); // { peerUserID: [messageObjects] }
  const [messages, setMessages] = useState([]); // messages of activeConversation
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const zimRef = useRef(null);

  // Helper: Add new messages to allMessages store
  const addMessagesForPeer = useCallback((peerId, newMsgs) => {
    setAllMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), ...newMsgs],
    }));
  }, []);

  useEffect(() => {
    if (!user) return;

    const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID_CHAT);
    const appSign = import.meta.env.VITE_ZEGO_APP_SIGN_CHAT;

    const zimInstance = ZIM.create({ appID, appSign });
    if (!zimInstance) {
      toast.error("Failed to initialize ZIM SDK");
      setIsLoading(false);
      return;
    }
    zimRef.current = zimInstance;

    zimInstance.on("error", (zim, errorInfo) => {
      console.error("ZIM SDK error:", errorInfo.code, errorInfo.message);
      toast.error("Chat SDK error: " + errorInfo.message);
    });

    zimInstance.on("connectionStateChanged", (zim, { state, event }) => {
      console.log("connectionStateChanged", state, event);
      if (state === 0 && event === 3) {
        handleLogin();
      }
    });

zimInstance.on("peerMessageReceived", (zim, { messageList, fromConversationID }) => {
  console.log("peerMessageReceived", messageList, fromConversationID);
  addMessagesForPeer(fromConversationID, messageList);

  if (activeConversation && activeConversation.userID === fromConversationID) {
    setMessages((prev) => [...prev, ...messageList]);
  } else {
    const fromUser = connections.find((conn) => conn.userID === fromConversationID);
    const fromUserName = fromUser ? fromUser.userName : fromConversationID;
    toast.info(`New message from ${fromUserName}`);
  }
});

    async function handleLogin() {
      try {
        const token = await generateZimToken(user._id);
        zimInstance.login(user._id, {
          userName: user.name,
          token,
        });
        console.log("ZIM login successful");
        setIsReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Login failed", err);
        toast.error("Login failed: " + (err.message || err));
        setIsLoading(false);
      }
    }

    handleLogin();

    return () => {
      zimInstance.destroy();
      setIsReady(false);
    };
  }, [user, generateZimToken, activeConversation, addMessagesForPeer]);

  useEffect(() => {
    async function fetchConnections() {
      try {
        setIsLoading(true);
        const conns = await getChatConnections();
        setConnections(conns);
      } catch {
        toast.error("Could not load chat contacts.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchConnections();
  }, [getChatConnections]);

  const handleConversationClick = useCallback(
    async (connection) => {
      setActiveConversation(connection);

      // Load messages from cache if available, else empty array
      setMessages(allMessages[connection.userID] || []);

      if (!isReady || !zimRef.current) {
        toast.error("Chat is not ready yet.");
        return;
      }

      try {
        // Optionally fetch history from ZIM if not cached
        if (!allMessages[connection.userID]) {
          const res = await zimRef.current.queryHistoryMessage(connection.userID, 0, {
            count: 100,
          });
          if (res.messageList) {
            addMessagesForPeer(connection.userID, res.messageList);
            setMessages(res.messageList);
          }
        }
      } catch (error) {
        console.error("Failed to load history messages:", error);
        toast.error("Could not load message history.");
      }
    },
    [isReady, allMessages, addMessagesForPeer]
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation) return;

    if (!isReady || !zimRef.current) {
      toast.error("Chat service not connected.");
      return;
    }

    const messageTextObj = { type: 1, message: newMessage };
    const toConversationID = activeConversation.userID;
    const conversationType = 0; // 0 for 1-on-1 chat
    const config = { priority: 1 };
    const notification = {
      onMessageAttached: (msg) => {
        console.log("Message attached", msg);
      },
    };

    try {
      const { message } = await zimRef.current.sendMessage(
        messageTextObj,
        toConversationID,
        conversationType,
        config,
        notification
      );
      // Add sent message to local state immediately
      addMessagesForPeer(toConversationID, [message]);
      if (activeConversation.userID === toConversationID) {
        setMessages((prev) => [...prev, message]);
      }
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.info("User is offline");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel */}
        <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col bg-gray-900">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">My Connections</h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            {connections.length > 0 ? (
              connections.map((conn) => (
                <div
                  key={conn.userID}
                  onClick={() => handleConversationClick(conn)}
                  className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                    activeConversation?.userID === conn.userID ? "bg-yellow-400/10" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                    {conn.userName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-white font-medium">{conn.userName}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-400">
                You have no active conversations. Complete a 1-on-1 session to start chatting.
              </p>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex w-2/3 flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                  {activeConversation.userName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-white">{activeConversation.userName}</h3>
              </div>
              <div className="flex-grow p-6 overflow-y-auto bg-gray-800/50">
                {messages.map((msg) => (
                  <div
                    key={msg.messageID}
                    className={`flex mb-4 ${
                      msg.senderUserID === user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg ${
                        msg.senderUserID === user._id ? "bg-yellow-400 text-navy-900" : "bg-gray-700 text-white"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-4"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                />
                <button type="submit" className="btn-primary p-3">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
