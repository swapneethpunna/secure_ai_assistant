import { useState } from "react";

type Document = {
  id: string;
  name: string;
  size: string;
  date: string;
};

const initialDocs: Document[] = [
  { id: "1", name: "security_policy.pdf",       size: "2.4 MB",  date: "Mar 8, 2026"  },
  { id: "2", name: "password_guidelines.pdf",   size: "1.1 MB",  date: "Mar 7, 2026"  },
  { id: "3", name: "incident_response_plan.pdf",size: "3.2 MB",  date: "Mar 5, 2026"  },
  { id: "4", name: "data_classification.pdf",   size: "890 KB",  date: "Mar 3, 2026"  },
  { id: "5", name: "access_control_policy.pdf", size: "1.5 MB",  date: "Feb 28, 2026" },
  { id: "6", name: "encryption_standards.pdf",  size: "2.1 MB",  date: "Feb 25, 2026" },
];

const MyDocuments = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="mydocs-page">
      {/* Header row */}
      <div className="mydocs-header">
        <div>
          <h1 className="mydocs-title">My Documents</h1>
          <p className="mydocs-subtitle">{docs.length} documents uploaded</p>
        </div>
        <div className="mydocs-search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="mydocs-search"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mydocs-table-wrap">
        <table className="mydocs-table">
          <thead>
            <tr>
              <th>DOCUMENT NAME</th>
              <th>UPLOAD DATE</th>
              <th>SIZE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="mydocs-empty">No documents found.</td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc.id} className="mydocs-row">
                  <td>
                    <div className="doc-name-cell">
                      <div className="doc-file-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <span className="doc-name">{doc.name}</span>
                    </div>
                  </td>
                  <td className="doc-date">{doc.date}</td>
                  <td className="doc-size">{doc.size}</td>
                  <td>
                    <div className="doc-actions">
                      {/* Download */}
                      <button className="doc-action-btn" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        className="doc-action-btn doc-delete-btn"
                        title="Delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDocuments;