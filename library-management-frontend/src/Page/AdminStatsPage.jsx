import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMonthlyBorrowStats,
  getCategoryBorrowStats,
  getAuthorBorrowStats,
} from "../Services/statisticService";

function AdminStatsPage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ["MONTHLY_STATS", year],
    queryFn: () => getMonthlyBorrowStats(year).then((res) => res.data),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["CATEGORY_STATS"],
    queryFn: () => getCategoryBorrowStats().then((res) => res.data),
  });

  const { data: authorData, isLoading: authorLoading } = useQuery({
    queryKey: ["AUTHOR_STATS"],
    queryFn: () => getAuthorBorrowStats().then((res) => res.data),
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Inline styles
  const styles = {
    page: {
      backgroundColor: "#fff",
      minHeight: "100vh",
      padding: "1rem",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: window.innerWidth <= 640 ? "0.5rem" : "1rem 1.5rem",
    },
    header: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginBottom: "2rem",
      flexDirection: window.innerWidth <= 640 ? "column" : "row",
      alignItems: "center",
    },
    tabButton: (isActive) => ({
      padding: "0.5rem 1rem",
      backgroundColor: isActive ? "#6d28d9" : "#e5e7eb",
      color: isActive ? "#fff" : "#4b5563",
      border: "none",
      borderRadius: "0.25rem",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      width: window.innerWidth <= 640 ? "100%" : "auto",
      maxWidth: "200px",
      ":hover": {
        backgroundColor: isActive ? "#5b21b6" : "#d1d5db",
      },
    }),
    content: {
      backgroundColor: "#fff",
      padding: window.innerWidth <= 640 ? "1rem" : "1.5rem",
      borderRadius: "0.5rem",
    },
    section: {
      h2: {
        fontSize: window.innerWidth <= 640 ? "1.25rem" : "1.5rem",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "1rem",
        textAlign: "center",
      },
    },
    filter: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexDirection: window.innerWidth <= 640 ? "column" : "row",
      justifyContent: "center",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.25rem",
      fontSize: "0.9rem",
      width: window.innerWidth <= 640 ? "100%" : "120px",
      maxWidth: "150px",
      transition: "border-color 0.2s ease",
      ":focus": {
        borderColor: "#6d28d9",
        outline: "none",
      },
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      overflow: "hidden",
    },
    th: {
      padding: window.innerWidth <= 640 ? "0.5rem" : "0.75rem",
      textAlign: "left",
      backgroundColor: "#e5e7eb",
      fontWeight: "600",
      color: "#4b5563",
      fontSize: window.innerWidth <= 640 ? "0.85rem" : "1rem",
      borderBottom: "1px solid #d1d5db",
      textTransform: "uppercase",
    },
    td: {
      padding: window.innerWidth <= 640 ? "0.5rem" : "0.75rem",
      color: "#111827",
      fontSize: window.innerWidth <= 640 ? "0.85rem" : "1rem",
      borderBottom: "1px solid #e5e7eb",
    },
    tr: {
      transition: "background-color 0.2s ease",
      ":hover": {
        backgroundColor: "#f9fafb",
      },
    },
    loading: {
      textAlign: "center",
      fontSize: "1rem",
      color: "#6b7280",
      padding: "1.5rem",
    },
  };

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#111827",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Admin Statistics
        </h1>

        {/* Header with buttons */}
        <div style={styles.header}>
          <button
            style={styles.tabButton(activeTab === "monthly")}
            onClick={() => handleTabChange("monthly")}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "monthly" ? "#5b21b6" : "#d1d5db")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "monthly" ? "#6d28d9" : "#e5e7eb")
            }
          >
            Monthly Stats
          </button>
          <button
            style={styles.tabButton(activeTab === "category")}
            onClick={() => handleTabChange("category")}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "category" ? "#5b21b6" : "#d1d5db")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "category" ? "#6d28d9" : "#e5e7eb")
            }
          >
            Category Stats
          </button>
          <button
            style={styles.tabButton(activeTab === "author")}
            onClick={() => handleTabChange("author")}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "author" ? "#5b21b6" : "#d1d5db")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor =
                activeTab === "author" ? "#6d28d9" : "#e5e7eb")
            }
          >
            Author Stats
          </button>
        </div>

        {/* Content area */}
        <div style={styles.content}>
          {activeTab === "monthly" && (
            <div style={styles.section}>
              <h2 style={styles.section.h2}>Monthly Borrow Stats</h2>
              <div style={styles.filter}>
                <label style={styles.label}>Select Year:</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  style={styles.input}
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
              {monthlyLoading ? (
                <div style={styles.loading}>Loading...</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Month</th>
                      <th style={styles.th}>Total Borrowed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData && monthlyData.length > 0 ? (
                      monthlyData.map((item, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>{item.month}</td>
                          <td style={styles.td}>{item.totalBorrowed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={styles.td}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "category" && (
            <div style={styles.section}>
              <h2 style={styles.section.h2}>Category Borrow Stats</h2>
              {categoryLoading ? (
                <div style={styles.loading}>Loading...</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Category Name</th>
                      <th style={styles.th}>Borrow Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData && categoryData.length > 0 ? (
                      categoryData.map((item, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>{item.categoryName}</td>
                          <td style={styles.td}>{item.borrowCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={styles.td}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "author" && (
            <div style={styles.section}>
              <h2 style={styles.section.h2}>Author Borrow Stats</h2>
              {authorLoading ? (
                <div style={styles.loading}>Loading...</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Author Name</th>
                      <th style={styles.th}>Borrow Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorData && authorData.length > 0 ? (
                      authorData.map((item, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>{item.authorName}</td>
                          <td style={styles.td}>{item.borrowCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={styles.td}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminStatsPage;
