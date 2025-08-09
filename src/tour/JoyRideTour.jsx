import React, { useState, useEffect } from "react";
import JoyRide from "react-joyride";

const JoyRideTour = () => {
  // Check localStorage to see if tour was shown
  const [run, setRun] = useState(false);

  useEffect(() => {
    const tourShown = localStorage.getItem("mentorhub_joyride_shown");
    if (!tourShown) {
      setRun(true);
    }
  }, []);

  const steps = [
    {
      target: ".navbar-logo",
      content: "Welcome to MentorHub! Click this logo anytime to return to the homepage.",
      disableBeacon: true,
    },
    {
      target: ".navbar-explore",
      content: "Explore our mentors and sessions here.",
    },
    {
      target: ".navbar-dashboard",
      content: "Access your personal dashboard from here.",
    },
    {
      target: ".navbar-contact",
      content: "Need help? Reach out to us anytime here.",
    },
    {
      target: ".hero-section",
      content: "This is the homepage hero section, where you’ll see the most important updates and features.",
    },
    // {
    //   target: ".features-section",
    //   content: "Check out some of the best things MentorHub offers here.",
    // },
    {
      target: ".dashboard-welcome",
      content: "Hey there! 👋 Welcome to your Student Dashboard. This is where your entire learning journey lives.",
      disableBeacon: true,
    },
    {
      target: ".dashboard-tabs",
      content: "Here are your main sections — switch between your sessions, browse new mentors, or check payments anytime.",
    },
    {
      target: ".sessions-calendar",
      content: "This calendar shows all your upcoming and ongoing sessions. No more missed classes!",
    },
    {
      target: ".sessions-ongoing",
      content: "If you have a live session right now, you'll find a Join button here. Just click and hop in!",
    },
    {
      target: ".sessions-upcoming",
      content: "Here you’ll see your scheduled sessions, so you can plan ahead.",
    },
    {
      target: ".browse-mentors",
      content: "Looking to learn something new? Use this section to search and filter for mentors in your chosen field.",
    },
    {
      target: ".transactions-table",
      content: "Your payment history is here. It keeps track of all your bookings and refunds.",
    },
    {
      target: ".chatbot-widget",
      content: "Need help or quick answers? Ask our chatbot anytime.",
    },
    {
      target: ".mentor-dashboard-welcome",
      content: "Welcome to your Mentor Dashboard! This is your hub for managing sessions, students, and earnings.",
      disableBeacon: true,
    },
    {
      target: ".mentor-sessions-list",
      content: "Here’s your session list — view upcoming classes, join live ones, and review completed sessions.",
    },
    {
      target: ".mentor-student-requests",
      content: "Check here for new session requests from students. You can accept or decline them easily.",
    },
    {
      target: ".mentor-calendar",
      content: "This calendar helps you keep track of your teaching schedule at a glance.",
    },
    {
      target: ".mentor-earnings",
      content: "Your earnings overview is here — see total income, pending payments, and payment history.",
    },
    {
      target: ".mentor-reviews",
      content: "Read student feedback and ratings to improve your mentoring experience.",
    },
    {
      target: ".mentor-settings",
      content: "Update your profile, set your availability, and manage other preferences here.",
    },
  ];

  // On finish or skip, save flag to localStorage to not show again
  const handleCallback = (data) => {
    const { status } = data;
    if (["finished", "skipped"].includes(status)) {
      localStorage.setItem("mentorhub_joyride_shown", "true");
      setRun(false);
    }
  };

  return (
    <JoyRide
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      styles={{
        options: {
          arrowColor: "#4f46e5",
          backgroundColor: "#fff",
          overlayColor: "rgba(0, 0, 0, 0.6)",
          primaryColor: "#4f46e5", // Tailwind indigo-600
          textColor: "#1f2937",
          zIndex: 10000,
          borderRadius: 12,
          boxShadow:
            "0 8px 24px rgba(79, 70, 229, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: 24,
          transition: "all 0.4s ease-in-out",
        },
        tooltipContainer: {
          transition: "opacity 0.5s ease, transform 0.5s ease",
          borderRadius: 12,
        },
        buttonNext: {
          backgroundColor: "#4f46e5",
          borderRadius: "8px",
          padding: "10px 20px",
          fontWeight: "700",
          boxShadow: "0 4px 14px rgb(79 70 229 / 0.6)",
          transition: "background-color 0.3s ease",
        },
        buttonNextHover: {
          backgroundColor: "#4338ca",
        },
        buttonBack: {
          color: "#4f46e5",
          fontWeight: "600",
          marginRight: 14,
          fontSize: 15,
        },
        buttonSkip: {
          color: "#9ca3af",
          fontWeight: "600",
          fontSize: 14,
          cursor: "pointer",
          padding: "6px 12px",
        },
        overlay: {
          transition: "opacity 0.4s ease",
        },
      }}
      callback={handleCallback}
    />
  );
};

export default JoyRideTour;
