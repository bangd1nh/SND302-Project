import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopBorrowedBooks } from "../Services/statisticService";
import "../style.scss";

function TopBorrowedBooks() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["TOP_BOOKS", dateRange.startDate, dateRange.endDate],
    queryFn: () =>
      getTopBorrowedBooks(dateRange.startDate, dateRange.endDate).then(
        (res) => res.data
      ),
    enabled: true,
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    refetch();
  };

  if (isLoading) {
    return <div className="loading-text">Loading...</div>;
  }

  return (
    <div className="top-borrowed-books">
      {/* Date filter section */}
      <div className="filter-section">
        <div className="date-input">
          <label className="label">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="input"
          />
        </div>
        <div className="date-input">
          <label className="label">End Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="input"
          />
        </div>
        <button onClick={handleFilter} className="filter-button">
          Filter
        </button>
      </div>

      {/* Book list section */}
      <div className="books-grid">
        {data && data.length > 0 ? (
          data.map((book, index) => (
            <div key={index} className="book-card">
              <div className="book-cover">
                <img
                  alt={book.title}
                  className="book-image"
                  src={
                    book.imgUrl ||
                    "https://via.placeholder.com/300x350?text=No+Image"
                  } // Dùng imgUrl gốc, fallback nếu không có
                />
              </div>
              <div className="book-info">
                <h3 className="book-category">Top Book</h3>
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">
                  Author: <span className="font-medium">Unknown</span>
                </p>
                <span className="book-stats">
                  Borrowed: {book.borrowCount} times
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No books found for this date range.</div>
        )}
      </div>
    </div>
  );
}
export default TopBorrowedBooks;
