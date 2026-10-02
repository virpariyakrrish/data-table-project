import React, { useState, useEffect } from 'react';
import './App.css';
import { studentsData } from './studentsData';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('students_data');
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData(studentsData);
        localStorage.setItem('students_data', JSON.stringify(studentsData));
      }
    } catch (err) {
      console.error("Error reading from local storage", err);
      setData(studentsData);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some(
      (val) => String(val).toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={`app-container ${rowsPerPage === 5 ? 'fixed-height' : 'auto-height'}`}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ROLL NO.</th>
              <th>NAME</th>
              <th>
                <div className="header-with-icon">
                  DSA
                  <span className="filter-icon">▼</span>
                </div>
              </th>
              <th>MATHS</th>
              <th>DBMS</th>
              <th>NETWORKING</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id}>
                  <td>{row.rollNo}</td>
                  <td className="font-bold">{row.name}</td>
                  <td>{row.dsa}</td>
                  <td>{row.maths}</td>
                  <td>{row.dbms}</td>
                  <td>{row.networking}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="rows-per-page">
          <span>Rows per Page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="rows-select"
          >
            <option value={5}>5</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pagination-info">
          {totalItems === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalItems}`}
        </div>

        <div className="pagination-controls">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="icon-btn"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages || totalItems === 0}
            className="icon-btn"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
