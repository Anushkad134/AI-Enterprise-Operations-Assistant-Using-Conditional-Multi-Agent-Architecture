import { useState } from "react";
import {
  Plus,
  Send,
  Menu,
  X,
  Sparkles,
  BriefcaseBusiness,
  Laptop,
  Receipt,
  ShoppingBag,
  Users,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

import { useChat } from "./hooks/useChat";
import "./index.css";


const departments = [
  {
    name: "HR",
    icon: Users,
    className: "dept-hr",
  },
  {
    name: "IT SUPPORT",
    icon: Laptop,
    className: "dept-it",
  },
  {
    name: "FINANCE",
    icon: Receipt,
    className: "dept-finance",
  },
  {
    name: "SALES",
    icon: BriefcaseBusiness,
    className: "dept-sales",
  },
  {
    name: "PROCUREMENT",
    icon: ShoppingBag,
    className: "dept-procurement",
  },
];


function App() {
  const {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    clearChat,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    await sendMessage(input);
  };


  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-top">

          <div className="brand-mark">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>

          <div className="brand-text">
            <span>ENTERPRISE</span>
            <span>OPERATIONS</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>


        <button
          className="new-chat-button"
          onClick={clearChat}
        >
          <Plus size={18} />
          <span>NEW CHAT</span>
        </button>


        <div className="sidebar-section">

          <div className="sidebar-label">
            WORKSPACE
          </div>

          <div className="workspace-card">

            <div className="workspace-icon">
              <BriefcaseBusiness size={17} />
            </div>

            <div>
              <strong>Operations Desk</strong>
              <span>All departments</span>
            </div>

          </div>

        </div>


        <div className="sidebar-section">

          <div className="sidebar-label">
            DEPARTMENTS
          </div>

          <div className="department-list">

            {departments.map((department) => {

              const Icon = department.icon;

              return (
                <div
                  className="department-item"
                  key={department.name}
                >
                  <div className={`department-icon ${department.className}`}>
                    <Icon size={15} />
                  </div>

                  <span>{department.name}</span>

                  <ChevronRight
                    size={14}
                    className="department-arrow"
                  />
                </div>
              );
            })}

          </div>

        </div>


        <div className="sidebar-bottom">

          <div className="help-card">

            <div className="help-icon">
              <CircleHelp size={17} />
            </div>

            <div>
              <strong>Need assistance?</strong>
              <span>Ask the Operations Assistant.</span>
            </div>

          </div>

          <div className="sidebar-footer">
            AI OPERATIONS SYSTEM · 1.0
          </div>

        </div>

      </aside>


      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* MAIN */}
      <main className="main-content">

        {/* HEADER */}
        <header className="top-header">

          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="header-title">
            OPERATIONS ASSISTANT
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </div>

        </header>


        {/* CHAT AREA */}
        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome-section">

              <div className="welcome-eyebrow">
                <span className="eyebrow-line"></span>
                YOUR DIGITAL OPERATIONS DESK
              </div>


              <h1>
                HOW CAN WE
                <br />
                <span>HELP YOU?</span>
              </h1>


              <p className="welcome-description">
                One place for everyday questions across HR,
                IT, Finance, Sales and Procurement.
              </p>


              <div className="department-pills">

                {departments.map((department) => {

                  const Icon = department.icon;

                  return (
                    <div
                      className={`department-pill ${department.className}`}
                      key={department.name}
                    >
                      <Icon size={15} />
                      {department.name}
                    </div>
                  );

                })}

              </div>


              <div className="suggestion-grid">

                <button
                  onClick={() => setInput("My laptop is not connecting to the office WiFi")}
                >
                  <span>01</span>
                  IT SUPPORT
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => setInput("How do I claim a travel expense?")}
                >
                  <span>02</span>
                  EXPENSE CLAIM
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => setInput("How many days of leave can I take?")}
                >
                  <span>03</span>
                  HR POLICY
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => setInput("I need to purchase a new monitor")}
                >
                  <span>04</span>
                  PROCUREMENT
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>

          ) : (

            <div className="conversation">

              <div className="conversation-heading">
                <span>CONVERSATION</span>
                <div></div>
              </div>


              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >

                  {message.role === "user" ? (

                    <div className="user-message">

                      <div className="message-meta">
                        YOU
                      </div>

                      <div className="user-bubble">
                        {message.content}
                      </div>

                    </div>

                  ) : (

                    <div className="assistant-message">

                      <div className="assistant-meta">

                        <div className="assistant-label">
                          <Sparkles size={14} />
                          OPERATIONS ASSISTANT
                        </div>

                        {message.category && (
                          <span className="category-badge">
                            {message.category.toUpperCase()} AGENT
                          </span>
                        )}

                      </div>

                      <div className="assistant-bubble">
                        {message.content}
                      </div>

                    </div>

                  )}

                </div>

              ))}


              {loading && (

                <div className="assistant-message loading-message">

                  <div className="assistant-meta">
                    <div className="assistant-label">
                      <Sparkles size={14} />
                      OPERATIONS ASSISTANT
                    </div>
                  </div>

                  <div className="typing-box">
                    <span></span>
                    <span></span>
                    <span></span>
                    ROUTING YOUR REQUEST
                  </div>

                </div>

              )}

            </div>

          )}

        </section>


        {/* INPUT */}
        <div className="input-section">

          <form
            className="chat-input-wrapper"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="ASK ABOUT HR, IT, FINANCE, SALES OR PROCUREMENT..."
              disabled={loading}
            />

            <button
              type="submit"
              className="send-button"
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>

          </form>

          <div className="input-note">
            AI-GENERATED RESPONSES · VERIFY SENSITIVE BUSINESS INFORMATION
          </div>

        </div>

      </main>

    </div>
  );
}


export default App;
