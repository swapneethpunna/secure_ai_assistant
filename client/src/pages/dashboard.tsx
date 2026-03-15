import { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import "../css/dashboard.css";
import UploadDocuments from "./upload_documents";
import MyDocuments from "./my_documents";
import Settings from "./settings";

export type Page = "assistant" | "upload" | "documents" | "settings";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
   const [activePage, setActivePage] = useState<Page>("assistant");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderContent = () => {
    switch (activePage) {
      case "upload":
        return <UploadDocuments />;
      case "documents":
        return <MyDocuments />;
      case "settings":
        return <Settings />;
      case "assistant":
      default:
        return (
          <div className="content">
            <div className="welcome-card">
              <div className="ai-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white" />
                  <path d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z" fill="white" opacity="0.8" />
                </svg>
              </div>
              <h1>Welcome to Secure AI Assistant</h1>
              <p>
                Upload documents and ask questions about them. Your data is
                encrypted and private.
              </p>
              <div className="buttons">
                <button className="upload-btn" onClick={() => setActivePage("upload")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Document
                </button>
                <button className="ask-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

 return (
    <div className="layout">
      <Sidebar collapsed={collapsed} activePage={activePage} onNavigate={setActivePage} />
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />
        {renderContent()}
        {activePage === "assistant" && (
          <div className="chat-bar">
            <input
              type="text"
              placeholder="Ask a question about your documents..."
              className="chat-input"
            />
            <button className="send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;