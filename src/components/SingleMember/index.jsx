import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
  const [notifications, setNotifications] = useState([]);

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

  // Check and update notifications for METAR and TAF
  useEffect(() => {
    // Initial check on mount
    if (data) {
      const initialTAFCheck = data.some(
        (row) => Number(row[FLIGHT_TABLE_HEADERS.TAF_DEP]) < 1000
      );
      const initialMETARCheck = data.some(
        (row) => Number(row[FLIGHT_TABLE_HEADERS.METAR]) < 1000
      );

      if (initialTAFCheck) {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: `⚠️ Initial TAF Check: Low Visibility Alert (${new Date().toLocaleTimeString()})`,
          type: "warning"
        }]);
      }

      if (initialMETARCheck) {
        setNotifications(prev => [...prev, {
          id: Date.now() + 1,
          message: `⚠️ Initial METAR Check: Low Visibility Alert (${new Date().toLocaleTimeString()})`,
          type: "warning"
        }]);
      }
    }

    // TAF Check - Every 4 hours
    const tafInterval = setInterval(() => {
      const hasTAFLow = data?.some(
        (row) => Number(row[FLIGHT_TABLE_HEADERS.TAF_DEP]) < 1000
      );

      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: hasTAFLow
          ? `⚠️ TAF Alert: Low Visibility Detected (${new Date().toLocaleTimeString()})`
          : `ℹ️ TAF Update: Normal Conditions (${new Date().toLocaleTimeString()})`,
        type: hasTAFLow ? "warning" : "info"
      }]);
    }, 14400000); // 4 hours

    // METAR Check - Every 30 minutes
    const metarInterval = setInterval(() => {
      const hasMetarLow = data?.some(
        (row) => Number(row[FLIGHT_TABLE_HEADERS.METAR]) < 1000
      );

      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: hasMetarLow
          ? `⚠️ METAR Alert: Low Visibility Detected (${new Date().toLocaleTimeString()})`
          : `ℹ️ METAR Update: Normal Conditions (${new Date().toLocaleTimeString()})`,
        type: hasMetarLow ? "warning" : "info"
      }]);
    }, 1800000); // 30 minutes

    return () => {
      clearInterval(tafInterval);
      clearInterval(metarInterval);
    };
  }, [data]);

  // Remove notifications after 10 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 10000); // 10 seconds display time
      return () => clearTimeout(timer);
    }
  }, [notifications]);

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

      {/* Enhanced Notification Box */}
      {notifications.length > 0 && (
        <div className={styles.notificationContainer}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.notificationBox} ${notif.type === "warning" ? styles.warningNotification : styles.infoNotification
                }`}
            >
              {notif.message}
            </div>
          ))}
        </div>
      )}

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
                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.origin ||
                    headers[value] === FLIGHT_TABLE_HEADERS.destination
                  ) {
                    return <td style={{ cursor: 'pointer' }} onClick={() => {
                      const url = `/jeppesen/${row[value]}`;  // This will be matched by the new page rendering
                      window.open(url, '_blank');
                    }} key={value}>{row[value]}</td>
                  }
                  return <td key={value}>{row[value]}</td>;
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
