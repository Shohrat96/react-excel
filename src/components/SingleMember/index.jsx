import React, { useState, useCallback, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import styles from "./SingleMember.module.css";
import CustomButton from "../CustomBtn";
import { FLIGHT_TABLE_HEADERS } from "../../types/constants";
import { formatTAFData } from "../../utils/formatTAFdata";
import CustomSliderComponent from "../CustomSlider";


const FlightsTable = ({ data, headers, member }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNAJOnly, setShowNAJOnly] = useState(false);
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);

  const tableRef = useRef();

  // Function to handle search term update
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleWarningsFilter = () => {
    setShowWarningsOnly((prev) => !prev);
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

      if (showWarningsOnly && !row.isWarning) return false;

      if (searchTerm) {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
  }, [data, searchTerm, showNAJOnly, showWarningsOnly]);


  const cleanedData = filteredData.filter(Boolean)
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
        <div className={styles.onlyAlerts}>
          <CustomSliderComponent active={showWarningsOnly} toggleActive={toggleWarningsFilter} activeTitle="Only Alerts" deactiveTitle="All Flights" />
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
            {cleanedData.map((row, index) => (
              <tr key={index} className={row.isWarning ? styles.warningRow : ""}>
                {Object.keys(headers).map((value, idx) => {
                  
                  if (headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEP || headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEST) {
                    
                    return (
                      <td key={value}>{formatTAFData(row[value])}</td>
                    )
                  }

                  return (
                    <td key={value}>{row[value]}</td>
                  )
                })}
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
