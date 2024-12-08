import React, { useState, useCallback, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import styles from "./SingleMember.module.css";
import CustomButton from "../CustomBtn";

const FlightsTable = ({ data, headers, member }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNAJOnly, setShowNAJOnly] = useState(false);

  const tableRef = useRef();

  // Function to handle search term update
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to toggle the NAJ filter
  const toggleNAJFilter = () => {
    setShowNAJOnly((prev) => !prev);
  };

  // Export to XLSX
  const xport = useCallback(() => {
    if (!tableRef.current) return;
    const wb = XLSX.utils.table_to_book(tableRef.current);
    XLSX.writeFile(wb, `${member}.xlsx`);
  }, [member]);


  // Memoized filtering logic
  const filteredData = useMemo(() => {
    if (!data) return null;
    return data.filter(row => {
      const hasNAJ = Object.values(row).some(value =>
        String(value).trim().toUpperCase() === "NAJ"
      );
      if (showNAJOnly && !hasNAJ) return false;
      if (searchTerm) {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
  }, [data, searchTerm, showNAJOnly]);


  const filteredData = data ? data.filter(Boolean) : n
  const validHeaders = typeof headers === "object" && headers !== null;
  const validData = filteredData && filteredData.length > 0;

  return (
    <div className={styles.tableContainer}>
      {/* Control Panel */}
      <div className={styles.controlsContainer}>
        <div className={styles.control}>
          <button onClick={xport} className={styles.controlButton}>
            Export XLSX
          </button>
        </div>
        <div className={styles.control}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.controlInput}
          />
        </div>
        <div className={styles.onlyNaj}>
          <CustomButton title={showNAJOnly ? "Show All" : "Only NAJ"} handleClick={toggleNAJFilter} />
            
        </div>
      </div>

      {/* Render the table */}
      {validHeaders && validData ? (
        <table className={styles.flightsTable} ref={tableRef}>
          <thead>
            <tr>
              {Object.values(headers).map((key, idx) => (
                <th key={idx}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
};

export default FlightsTable;
