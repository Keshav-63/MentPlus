"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Utility function to check if a question is technical related to CS/CE
const isTechnicalQuestion = (text) => {
  const keywords = [
    // Core CS & Programming
    "algorithm",
    "data structure",
    "array",
    "linked list",
    "stack",
    "queue",
    "heap",
    "priority queue",
    "hash table",
    "hash map",
    "tree",
    "binary tree",
    "binary search tree",
    "avl tree",
    "red-black tree",
    "b-tree",
    "trie",
    "suffix tree",
    "graph",
    "adjacency list",
    "adjacency matrix",
    "union-find",
    "sorting",
    "quick sort",
    "merge sort",
    "heap sort",
    "bubble sort",
    "insertion sort",
    "selection sort",
    "searching",
    "binary search",
    "dynamic programming",
    "greedy algorithm",
    "divide and conquer",
    "graph algorithms",
    "dijkstra",
    "bellman-ford",
    "floyd-warshall",
    "bfs",
    "dfs",
    "a*",
    "minimum spanning tree",
    "kruskal",
    "prim",
    "approximation algorithms",
    "complexity theory",
    "big o",
    "p vs np",
    "np-complete",
    "formal languages",
    "automata",
    "finite automata",
    "pushdown automata",
    "turing machine",
    "computability",
    "recursion",
    "memoization",
    "tail recursion",

    // Programming paradigms & languages
    "programming",
    "coding",
    "object oriented programming",
    "functional programming",
    "procedural programming",
    "declarative programming",
    "reactive programming",
    "event driven programming",
    "concurrent programming",
    "parallel computing",
    "imperative programming",
    "java",
    "python",
    "c++",
    "c#",
    "c",
    "rust",
    "go",
    "typescript",
    "javascript",
    "node",
    "deno",
    "swift",
    "kotlin",
    "ruby",
    "php",
    "perl",
    "scala",
    "haskell",
    "erlang",
    "lisp",
    "matlab",
    "r",
    "assembly",
    "bash",
    "powershell",

    // Web & Frontend
    "html",
    "css",
    "sass",
    "scss",
    "less",
    "responsive design",
    "accessibility",
    "a11y",
    "aria",
    "ui",
    "ux",
    "user interface",
    "user experience",
    "wireframe",
    "prototype",
    "design system",
    "material design",
    "neumorphism",
    "glassmorphism",
    "bootstrap",
    "tailwind",
    "semantic HTML",
    "svg",
    "canvas",
    "webgl",
    "three.js",
    "dom",
    "virtual dom",
    "react",
    "redux",
    "flux",
    "vue",
    "angular",
    "svelte",
    "state management",
    "client side",
    "server side",
    "progressive web app",
    "pwa",
    "service worker",
    "single page application",
    "spa",
    "seo",

    // Backend, APIs & Protocols
    "rest api",
    "restful",
    "graphql",
    "gql",
    "soap",
    "grpc",
    "http",
    "https",
    "tls",
    "ssl",
    "tcp",
    "udp",
    "socket programming",
    "websocket",
    "long polling",
    "api gateway",
    "rate limiting",
    "idempotency",
    "microservices",
    "monolith",
    "backend",
    "serverless",
    "lambda",
    "faas",
    "bff (backend for frontend)",
    "mvc",
    "mvvm",
    "mvp",
    "orm",
    "database",
    "sql",
    "nosql",
    "postgresql",
    "mysql",
    "sqlite",
    "mongodb",
    "cassandra",
    "redis",
    "memcached",
    "elastic",
    "neo4j",
    "graph database",
    "indexing",
    "query optimization",
    "transactions",
    "acidity",
    "acid",
    "base (eventual consistency)",
    "replication",
    "sharding",
    "backup",
    "restore",
    "etl",
    "data warehouse",
    "olap",
    "oltp",

    // DevOps & Infrastructure
    "devops",
    "ci",
    "cd",
    "ci/cd",
    "continuous integration",
    "continuous deployment",
    "continuous delivery",
    "jenkins",
    "github actions",
    "gitlab ci",
    "circleci",
    "bamboo",
    "docker",
    "container",
    "containerization",
    "kubernetes",
    "k8s",
    "helm",
    "istio",
    "service mesh",
    "virtualization",
    "vmware",
    "hypervisor",
    "bare metal",
    "terraform",
    "ansible",
    "puppet",
    "chef",
    "infrastructure as code",
    "autoscaling",
    "load balancer",
    "nginx",
    "apache",
    "cdn",
    "cloud computing",
    "aws",
    "azure",
    "google cloud",
    "gcp",
    "digitalocean",
    "edge computing",
    "hybrid cloud",
    "private cloud",
    "observability",
    "monitoring",
    "logging",
    "prometheus",
    "grafana",
    "elk",
    "elastic stack",
    "sentry",
    "newrelic",
    "tracing",
    "opentelemetry",

    // Security & Cryptography
    "cybersecurity",
    "encryption",
    "industry-standard encryption",
    "public key infrastructure",
    "pkI",
    "rsa",
    "aes",
    "sha",
    "sha256",
    "hash function",
    "hmac",
    "tls",
    "ssh",
    "oauth",
    "oauth2",
    "openid connect",
    "jwt",
    "sso",
    "authentication",
    "authorization",
    "mfa",
    "2fa",
    "password hashing",
    "bcrypt",
    "argon2",
    "pbkdf2",
    "xss",
    "csrf",
    "sql injection",
    "buffer overflow",
    "heap overflow",
    "format string",
    "secure coding",
    "threat modeling",
    "penetration testing",
    "pen testing",
    "vulnerability assessment",
    "vulnerability scanning",
    "firewall",
    "ids",
    "ips",
    "intrusion detection",
    "intrusion prevention",
    "siem",
    "malware",
    "malware analysis",
    "ransomware",
    "phishing",
    "social engineering",
    "sandboxing",
    "zero trust",
    "secure enclave",
    "hardware security module",
    "hsm",

    // Machine Learning & Data Science
    "machine learning",
    "artificial intelligence",
    "ai",
    "deep learning",
    "neural networks",
    "cnn",
    "convolutional neural network",
    "rnn",
    "recurrent neural network",
    "lstm",
    "gru",
    "transformer",
    "attention",
    "bert",
    "gpt",
    "gan",
    "autoencoder",
    "supervised learning",
    "unsupervised learning",
    "semi-supervised learning",
    "reinforcement learning",
    "q-learning",
    "policy gradients",
    "svm",
    "support vector machine",
    "decision tree",
    "random forest",
    "xgboost",
    "lightgbm",
    "catboost",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "keras",
    "mlops",
    "feature engineering",
    "data preprocessing",
    "normalization",
    "standardization",
    "cross validation",
    "k-fold",
    "train test split",
    "hyperparameter tuning",
    "grid search",
    "random search",
    "bayesian optimization",
    "overfitting",
    "underfitting",
    "regularization",
    "dropout",
    "batch normalization",
    "embeddings",
    "word2vec",
    "doc2vec",
    "nlp",
    "natural language processing",
    "computer vision",
    "image processing",
    "opencv",
    "object detection",
    "segmentation",
    "face recognition",
    "speech recognition",

    // Hardware, Embedded & Computer Architecture
    "computer",
    "computer architecture",
    "processor",
    "cpu",
    "gpu",
    "asic",
    "fpga",
    "microcontroller",
    "microprocessor",
    "arm",
    "x86",
    "instruction set",
    "isa",
    "risc",
    "cisc",
    "pipeline",
    "superscalar",
    "out-of-order execution",
    "branch prediction",
    "cache",
    "l1 cache",
    "l2 cache",
    "l3 cache",
    "memory hierarchy",
    "virtual memory",
    "paging",
    "tlb",
    "dma",
    "interrupt",
    "io",
    "peripheral",
    "gpio",
    "adc",
    "dac",
    "signal processing",
    "digital signal processing",
    "dsp",
    "embedded",
    "firmware",
    "rtl",
    "verilog",
    "vhdl",
    "system on chip",
    "soc",
    "pcb",
    "schematic",
    "soldering",
    "power management",
    "thermal design",

    // Datacenter, Storage & File Systems
    "filesystem",
    "ext4",
    "ntfs",
    "fat32",
    "zfs",
    "btrfs",
    "raid",
    "nas",
    "san",
    "object storage",
    "s3",
    "glacier",
    "block storage",
    "iops",
    "throughput",
    "latency",
    "ssd",
    "hdd",

    // Networking & Communication
    "network",
    "osi model",
    "application layer",
    "transport layer",
    "network layer",
    "data link",
    "physical layer",
    "ethernet",
    "wifi",
    "802.11",
    "routing",
    "switching",
    "bgp",
    "ospf",
    "mpls",
    "nat",
    "dhcp",
    "dns",
    "dnssec",
    "vpn",
    "ipsec",
    "proxy",
    "load balancing",
    "cdn",
    "packet",
    "frame",
    "mtu",
    "qos",
    "throughput",
    "bandwidth",

    // Software Engineering Practices
    "software",
    "software engineering",
    "engineering",
    "design patterns",
    "factory pattern",
    "singleton",
    "observer",
    "strategy",
    "decorator",
    "adapter",
    "mvc pattern",
    "clean architecture",
    "domain driven design",
    "ddd",
    "tdd",
    "test driven development",
    "bdd",
    "behavior driven development",
    "unit testing",
    "integration testing",
    "e2e testing",
    "system testing",
    "regression testing",
    "mocking",
    "stubbing",
    "code coverage",
    "linting",
    "formatting",
    "refactoring",
    "code review",
    "pair programming",
    "agile methodology",
    "scrum",
    "kanban",
    "sprint",
    "backlog",
    "user story",
    "acceptance criteria",
    "ci pipeline",
    "release management",
    "version control",
    "git",
    "svn",
    "mercurial",
    "branching",
    "gitflow",
    "changelog",
    "semantic versioning",

    // Tools & Build Systems
    "ide",
    "vscode",
    "intellij",
    "eclipse",
    "xcode",
    "android studio",
    "make",
    "cmake",
    "gradle",
    "maven",
    "ant",
    "bazel",
    "cargo",
    "npm",
    "yarn",
    "pip",
    "pipenv",
    "poetry",
    "gem",
    "brew",
    "apt",
    "rpm",
    "package manager",
    "dependency management",

    // Testing & Quality
    "benchmarking",
    "profiling",
    "performance tuning",
    "load testing",
    "stress testing",
    "fuzz testing",
    "profilers",
    "valgrind",
    "memory leak",
    "race condition",
    "deadlock",
    "livelock",
    "concurrency issues",
    "threading",
    "multithreading",
    "mutex",
    "semaphore",
    "lock",
    "atomic operations",
    "compare and swap",
    "lock free",

    // Misc & Emerging Topics
    "big data",
    "hadoop",
    "spark",
    "flink",
    "data analytics",
    "data mining",
    "data visualization",
    "d3",
    "power bi",
    "tableau",
    "etl pipeline",
    "stream processing",
    "kafka",
    "rabbitmq",
    "mq",
    "messaging",
    "iot",
    "mqtt",
    "coap",
    "robotics",
    "slam",
    "control systems",
    "autonomous systems",
    "computer graphics",
    "ray tracing",
    "rasterization",
    "vulkan",
    "directx",
    "opengl",
    "shader",
    "cuda",
    "opencl",
    "quantum computing",
    "qubit",
    "superposition",
    "entanglement",
    "quantum algorithms",
    "shor",
    "grover",
    "blockchain",
    "distributed ledger",
    "consensus algorithm",
    "pow",
    "pos",
    "smart contracts",
    "ethereum",
    "bitcoin",
    "cryptocurrency",
    "wallet",
    "gas",
    "dapp",

    // UI elements & image-specific words (from provided images)
    "timeline",
    "timeline node",
    "year marker",
    "milestone",
    "connector",
    "curve path",
    "gradient",
    "neon gradient",
    "iconography",
    "puzzle icon",
    "cloud icon",
    "globe icon",
    "lightbulb icon",
    "rounded card",
    "modal",
    "form",
    "input field",
    "placeholder",
    "placeholder text",
    "email address",
    "password",
    "password visibility",
    "eye icon",
    "password strength meter",
    "form validation",
    "inline error message",
    "cta",
    "call to action",
    "sign in",
    "sign up",
    "login",
    "signup",
    "authentication flow",
    "secure login",
    "industry-standard encryption",
    "contrast ratio",
    "drop shadow",
    "border radius",
    "rounded corners",
    "typography",
    "font family",
    "color palette",
    "dark theme",
    "light theme",
    "hero card",
    "microinteraction",
    "hover state",
    "focus state",
    "disabled state",
    "tooltip",
    "toast notification",

    // Keywords to help discover related areas
    "research",
    "theory",
    "applied",
    "simulation",
    "modeling",
    "benchmark",
    "standards",
    "protocol",
    "specification",
    "interop",
    "compliance",
    "regulation",
  ];

  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k));
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "👋 Hi there! I'm your MentorBot. Ask me computer science or computer engineering questions!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Read environment variables (Vite exposes VITE_ prefixed vars)
  // Fallback order: VITE_GOOGLE_API_KEY -> VITE_GEMINI_API_KEY -> VITE_OPENAI_API_KEY (legacy)
  const GOOGLE_API_KEY =
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    "";
  // Default to chat-bison-001 (stable). If you have a Gemini model, set VITE_GEMINI_MODEL.
  const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "chat-bison-001";

  // Helpers
  const toggleChat = () => {
    setIsOpen((p) => !p);
    if (isMinimized) setIsMinimized(false);
  };
  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized((p) => !p);
  };
  const appendMessage = (msg) => setMessages((prev) => [...prev, msg]);

  // Build messages formatted for Google's generative API (generateMessage)
  // Each message becomes: { author: "user"|"assistant"|"system", content: [{ type: "text", text: "..." }] }
  const buildGeminiMessages = (systemPrompt, allMessages) => {
    const lastN = allMessages.slice(-10); // last 10 messages for context
    const mapped = lastN.map((m) => {
      const author =
        m.role === "bot" ? "assistant" : m.role === "user" ? "user" : "user";
      return {
        author,
        content: m.content,
      };
    });

    // system prompt goes first
    const systemMessage = {
      author: "system",
      content: systemPrompt,
    };

    return [systemMessage, ...mapped];
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { role: "user", content: trimmedInput };
    appendMessage(userMessage);
    setInput("");
    setIsTyping(true);

    // Non-technical guard
    if (!isTechnicalQuestion(userMessage.content)) {
      appendMessage({
        role: "bot",
        content:
          "🤖 Sorry, I can only assist with technical questions related to computer science and computer engineering. Please ask something in those domains.",
      });
      setIsTyping(false);
      return;
    }

    // API key check
    if (
      !GOOGLE_API_KEY ||
      GOOGLE_API_KEY.trim() === "" ||
      GOOGLE_API_KEY.toLowerCase().includes("your")
    ) {
      appendMessage({
        role: "bot",
        content:
          "⚠ Google API key not configured. Set VITE_GOOGLE_API_KEY in your frontend .env (development only). For production, proxy requests through a backend for security.",
      });
      setIsTyping(false);
      return;
    }

    // System prompt guiding the assistant
    const systemPrompt =
      "You are MentorBot, an expert teaching assistant specialized in computer science and computer engineering. Answer clearly and concisely. Provide code examples when appropriate. When asked outside CS/CE, politely decline and ask to remain within domain.";

    try {
      // Build request body per Generative Language generateMessage
      const geminiMessages = buildGeminiMessages(systemPrompt, [
        ...messages,
        userMessage,
      ]);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/${GEMINI_MODEL}:generateMessage?key=${encodeURIComponent(
        GOOGLE_API_KEY
      )}`;

      const payload = {
        prompt: {
          messages: geminiMessages,
        },
        temperature: 0.2,
        candidateCount: 1,
        maxOutputTokens: 800,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // For API-key usage we pass key as query param. If using OAuth bearer token, pass Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to surface API error message
        let errMessage = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          if (j?.error?.message) errMessage += ` - ${j.error.message}`;
        } catch (err) {
          // ignore parsing error
        }
        throw new Error(`Generative API error: ${errMessage}`);
      }

      const data = await res.json();

      // Response shape: data.candidates is an array,
      // each candidate has content: [{ type: 'text', text: '...' }, ...]
      // We'll join candidate content pieces into a single string.
      const candidate = data?.candidates?.[0];
      let botText = "";

      if (candidate && Array.isArray(candidate.content)) {
        botText = candidate.content
          .map((c) => {
            if (c.type === "text" && typeof c.text === "string") return c.text;
            // Some responses may include other types; ignore for now.
            return "";
          })
          .join("")
          .trim();
      }

      // Fallbacks
      if (!botText) {
        // Some endpoints also return "output" or "response" fields — try common alternatives
        botText =
          data?.output?.[0]?.content?.map((c) => c.text).join("") ||
          data?.response?.candidates?.[0]?.content
            ?.map((c) => c.text)
            .join("") ||
          "";
      }

      if (!botText) {
        appendMessage({
          role: "bot",
          content:
            "I'm sorry — I couldn't produce a response. Please rephrase your question or try again.",
        });
      } else {
        appendMessage({
          role: "bot",
          content: botText,
        });
      }
    } catch (error) {
      console.error("Generative API error:", error);
      appendMessage({
        role: "bot",
        content:
          "⚠ Sorry, I'm having trouble connecting to the Generative AI service. Please try again later. (" +
          (error?.message || "unknown error") +
          ")",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (ev) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(ev.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const colors = {
    navyBlue: "#1A1A2E",
    gold: "#FFD700",
    white: "#FFFFFF",
  };

  return (
    <div
      className="fixed bottom-5 right-6 z-50 font-inter"
      ref={chatWindowRef}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        aria-label="Toggle chat"
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300"
        style={{
          backgroundColor: isOpen ? colors.gold : colors.navyBlue,
          transform: isOpen ? "rotate(90deg) scale(1.1)" : "none",
          transitionProperty: "background-color, transform",
          transitionDuration: "300ms",
        }}
      >
        {isOpen ? (
          <X className="w-7 h-7" style={{ color: colors.navyBlue }} />
        ) : (
          <MessageSquare className="w-7 h-7" style={{ color: colors.gold }} />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="absolute right-0 flex flex-col rounded-lg shadow-2xl border transition-all duration-500 ease-in-out select-text"
          style={{
            height: isMinimized ? "4rem" : "32rem",
            width: "22rem",
            bottom: isMinimized ? "5.5rem" : "6rem",
            borderColor: colors.gold,
            backgroundColor: colors.navyBlue,
            color: colors.white,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b cursor-default select-none"
            style={{ borderColor: colors.gold }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.gold }}
              >
                <MessageSquare
                  className="w-6 h-6"
                  style={{ color: colors.navyBlue }}
                />
              </div>
              <div>
                <h3
                  className="font-extrabold text-lg tracking-wide"
                  style={{ color: colors.gold }}
                >
                  MentorBot
                </h3>
                <p className="text-xs italic" style={{ color: "#FFFACD" }}>
                  {isTyping ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Expand Chat" : "Minimize Chat"}
                title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                className="p-1.5 rounded-full hover:bg-opacity-30 transition-colors"
                style={{ color: colors.gold, backgroundColor: "transparent" }}
              >
                {isMinimized ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Messages & Input */}
          {!isMinimized && (
            <>
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${colors.gold} transparent`,
                }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className="max-w-[80%] rounded-2xl p-3.5 shadow-sm break-words whitespace-pre-wrap"
                      style={{
                        backgroundColor:
                          msg.role === "user" ? colors.gold : "#2D2D5B",
                        color:
                          msg.role === "user" ? colors.navyBlue : colors.gold,
                        fontWeight: msg.role === "user" ? 600 : 500,
                      }}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div
                      className="p-3.5 rounded-2xl font-medium"
                      style={{ backgroundColor: "#2D2D5B", color: colors.gold }}
                    >
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-3 border-t flex gap-2"
                style={{ borderColor: colors.gold, backgroundColor: "#12122B" }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your question..."
                  className="flex-1 px-4 py-3 rounded-full placeholder-opacity-75 focus:outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: "#2D2D5B",
                    color: colors.gold,
                    border: "none",
                    caretColor: colors.gold,
                    boxShadow: "none",
                    outlineColor: colors.gold,
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="User question input"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{
                    backgroundColor: colors.gold,
                    color: colors.navyBlue,
                    boxShadow: "0 0 8px rgba(255, 215, 0, 0.7)",
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;






























//   const textLower = text.toLowerCase();
//   return keywords.some((keyword) => textLower.includes(keyword));
// };

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       role: "bot",
//       content:
//         "👋 Hi there! I'm your MentorBot. Ask me computer science or computer engineering questions!",
//     },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const chatWindowRef = useRef(null);

// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

//   const toggleChat = () => {
//     setIsOpen((prev) => !prev);
//     if (isMinimized) setIsMinimized(false);
//   };

//   const toggleMinimize = (e) => {
//     e.stopPropagation();
//     setIsMinimized((prev) => !prev);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trimmedInput = input.trim();
//     if (!trimmedInput) return;

//     const userMessage = { role: "user", content: trimmedInput };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     if (!isTechnicalQuestion(userMessage.content)) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           content:
//             "🤖 Sorry, I can only assist with technical questions related to computer science and computer engineering. Please ask something in those domains.",
//         },
//       ]);
//       setIsTyping(false);
//       return;
//     }

//     try {
//       // Prepare last 10 messages including new user message for context
//       const messagesForAPI = [...messages, userMessage]
//         .slice(-10)
//         .map((msg) => ({
//           role: msg.role,
//           content: msg.content,
//         }));

//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-4",
//           messages: messagesForAPI,
//           temperature: 0.3,
//           max_tokens: 1000,
//           n: 1,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       const botReply = data.choices?.[0]?.message?.content?.trim();

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           content:
//             botReply ||
//             "I'm sorry, I couldn't process your question. Could you please rephrase?",
//         },
//       ]);
//     } catch (error) {
//       console.error("Error fetching bot response:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           content:
//             "⚠ Sorry, I'm having trouble connecting to the server or OpenAI. Please try again later.",
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         chatWindowRef.current &&
//         !chatWindowRef.current.contains(event.target) &&
//         isOpen
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   const colors = {
//     navyBlue: "#1A1A2E",
//     gold: "#FFD700",
//     white: "#FFFFFF",
//   };

//   return (
//     <div
//       className="fixed bottom-5 right-6 z-50 font-inter"
//       ref={chatWindowRef}
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* Toggle Button */}
//       <button
//         onClick={toggleChat}
//         aria-label="Toggle chat"
//         className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300"
//         style={{
//           backgroundColor: isOpen ? colors.gold : colors.navyBlue,
//           transform: isOpen ? "rotate(90deg) scale(1.1)" : "none",
//           transitionProperty: "background-color, transform",
//           transitionDuration: "300ms",
//         }}
//       >
//         {isOpen ? (
//           <X className="w-7 h-7" style={{ color: colors.navyBlue }} />
//         ) : (
//           <MessageSquare className="w-7 h-7" style={{ color: colors.gold }} />
//         )}
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           className="absolute right-0 flex flex-col rounded-lg shadow-2xl border transition-all duration-500 ease-in-out select-text"
//           style={{
//             height: isMinimized ? "4rem" : "32rem",
//             width: "20rem",
//             bottom: isMinimized ? "5.5rem" : "6rem",
//             borderColor: colors.gold,
//             backgroundColor: colors.navyBlue,
//             color: colors.white,
//           }}
//         >
//           {/* Header */}
//           <div
//             className="flex items-center justify-between p-4 border-b cursor-default select-none"
//             style={{ borderColor: colors.gold }}
//           >
//             <div className="flex items-center space-x-3">
//               <div
//                 className="w-10 h-10 rounded-full flex items-center justify-center"
//                 style={{ backgroundColor: colors.gold }}
//               >
//                 <MessageSquare
//                   className="w-6 h-6"
//                   style={{ color: colors.navyBlue }}
//                 />
//               </div>
//               <div>
//                 <h3
//                   className="font-extrabold text-lg tracking-wide"
//                   style={{ color: colors.gold }}
//                 >
//                   MentorBot
//                 </h3>
//                 <p className="text-xs italic" style={{ color: "#FFFACD" }}>
//                   {isTyping ? "Typing..." : "Online"}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={toggleMinimize}
//                 aria-label={isMinimized ? "Expand Chat" : "Minimize Chat"}
//                 title={isMinimized ? "Expand Chat" : "Minimize Chat"}
//                 className="p-1.5 rounded-full hover:bg-opacity-30 transition-colors"
//                 style={{ color: colors.gold, backgroundColor: "transparent" }}
//               >
//                 {isMinimized ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Messages & Input */}
//           {!isMinimized && (
//             <>
//               <div
//                 className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
//                 style={{
//                   scrollbarWidth: "thin",
//                   scrollbarColor: `${colors.gold} transparent`,
//                 }}
//               >
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       msg.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className="max-w-[80%] rounded-2xl p-3.5 shadow-sm break-words whitespace-pre-wrap"
//                       style={{
//                         backgroundColor:
//                           msg.role === "user" ? colors.gold : "#2D2D5B",
//                         color: msg.role === "user" ? colors.navyBlue : colors.gold,
//                         fontWeight: msg.role === "user" ? "600" : "500",
//                       }}
//                     >
//                       <ReactMarkdown>{msg.content}</ReactMarkdown>
//                     </div>
//                   </div>
//                 ))}
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div
//                       className="p-3.5 rounded-2xl font-medium"
//                       style={{
//                         backgroundColor: "#2D2D5B",
//                         color: colors.gold,
//                       }}
//                     >
//                       Typing...
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               <form
//                 onSubmit={handleSubmit}
//                 className="p-3 border-t flex gap-2"
//                 style={{ borderColor: colors.gold, backgroundColor: "#12122B" }}
//               >
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Ask your question..."
//                   className="flex-1 px-4 py-3 rounded-full placeholder-opacity-75 focus:outline-none focus:ring-2 transition"
//                   style={{
//                     backgroundColor: "#2D2D5B",
//                     color: colors.gold,
//                     border: "none",
//                     caretColor: colors.gold,
//                     boxShadow: "none",
//                     outlineColor: colors.gold,
//                   }}
//                   autoComplete="off"
//                   spellCheck={false}
//                   aria-label="User question input"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!input.trim()}
//                   className="p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   style={{
//                     backgroundColor: colors.gold,
//                     color: colors.navyBlue,
//                     boxShadow: "0 0 8px rgba(255, 215, 0, 0.7)",
//                   }}
//                   aria-label="Send message"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;
