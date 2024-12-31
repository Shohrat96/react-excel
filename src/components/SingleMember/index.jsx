import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import styles from "./SingleMember.module.css";
import CustomButton from "../CustomBtn";
import { FLIGHT_TABLE_HEADERS } from "../../types/constants";
import { formatTAFData } from "../../utils/formatTAFdata";


const FlightsTable = ({ data, headers, member, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNAJOnly, setShowNAJOnly] = useState(false);
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);
  // const [notifications, setNotifications] = useState([]);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDestinationFilter = (e) => {
    const options = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedDestinations(options);
  };

  const tableRef = useRef();

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
  // const filteredData = useMemo(() => {
  //   if (!data) return null;
  //   return data.filter(Boolean).filter(row => {
  //     const hasNAJ = Object.values(row).some(value =>
  //       String(value).trim().toUpperCase() === "NAJ"
  //     );
  //     if (showNAJOnly && !hasNAJ) return false;

  //     if (showWarningsOnly && !row.isWarning) return false;

  //     if (searchTerm) {
  //       return Object.values(row).some(value => {
  //         if (selectedDestinations.length) {
  //           return String(value).toLowerCase().includes(searchTerm.toLowerCase()) && selectedDestinations.includes(row.destination)
  //         }
  //         return String(value).toLowerCase().includes(searchTerm.toLowerCase())
  //       }

  //       );
  //     }

  //     if (selectedDestinations.length > 0) {
  //       return selectedDestinations.includes(row.destination);
  //     }

  //     return true;
  //   });
  // }, [data, searchTerm, showNAJOnly, showWarningsOnly, selectedDestinations]);


  const validHeaders = typeof headers === "object" && headers !== null;
  const validData = data && data.length > 0;


  return (
    <div className={styles.tableContainer}>
      {/* Control Panel */}
      <div className={styles.controlsContainer}>
        <div className={styles.control}>
          <button onClick={xport} className={styles.controlButton}>
            Export XLSX
          </button>
        </div>

        {/* <div className={styles.onlyNaj}>
          <CustomButton title={showNAJOnly ? "Show All" : "Only NAJ"} handleClick={toggleNAJFilter} />

        </div> */}
      </div>

      {validHeaders && validData ? (
        <table className={styles.flightsTable} ref={tableRef}>
          <thead>
            <tr>
              {Object.values(headers).map((key, idx) => {
                return (
                  <th key={idx}>
                    {key}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={row?.isWarning ? styles.warningRow : ""}>
                {Object.keys(headers).map((value, idx) => {
                  const cellValue = row[value] || "";
                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEP ||
                    headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEST
                  ) {
                    return <td key={value}>{formatTAFData(cellValue)}</td>;
                  }

                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.origin ||
                    headers[value] === FLIGHT_TABLE_HEADERS.destination
                  ) {
                    return (
                      <td
                        key={value}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const url = `/jeppesen/${cellValue}`; // Validate the value before using it in a URL
                          if (cellValue) {
                            window.open(url, "_blank");
                          } else {
                            console.error("Invalid cell value for URL:", cellValue);
                          }
                        }}
                      >
                        {cellValue}
                      </td>
                    );
                  }

                  // Default case for rendering the cell
                  return <td key={value}>{cellValue}</td>;
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
