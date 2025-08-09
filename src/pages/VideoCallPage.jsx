import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const VideoCallPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    if (!user) {
        toast.error("You must be logged in to join a session.");
        navigate('/login');
        return null; // Render nothing while redirecting
    }

    const myMeeting = async (element) => {
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

        // Generate a kit token for the user. This is the insecure part for production.
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            user._id, // User's unique ID
            user.name // User's display name
        );

        // Create an instance of the ZegoUIKit
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Join the room and render the UI
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Copy Session Link',
                    url: window.location.href,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, use ZegoUIKitPrebuilt.OneONoneCall
            },
            onLeaveRoom: () => {
                // When the user leaves the call, redirect them to their dashboard
                navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard');
            },
            showScreenSharingButton: true,
        });
    };

    return (
        <div className="min-h-screen w-screen bg-gray-900">
            <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
            <div
                ref={myMeeting}
                style={{ width: '100vw', height: '100vh' }}
            />
        </div>
    );
};

export default VideoCallPage;
