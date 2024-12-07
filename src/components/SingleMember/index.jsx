import React, { useCallback, useRef, useState } from "react";
import styles from "./SingleMember.module.css";
import * as XLSX from "xlsx";
import CustomButton from "../CustomBtn";

const SingleMember = ({ data, headers, member }) => {
  const tableRef = useRef();

  const xport = useCallback(() => {
    /* Create worksheet from HTML DOM TABLE */
    if (!tableRef.current) return;

    const wb = XLSX.utils.table_to_book(tableRef.current);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, `${member}.xlsx`);
  }, [member]);

  const filteredData = data ? data.filter(Boolean) : null;
  console.log("filtered data: ", filteredData);
  const validHeaders = typeof headers === "object" && headers !== null;
  const validData = filteredData && filteredData.length > 0;

  return (
    <div className={styles.tableContainer}>
      <div>
        <CustomButton title="Export XLSX!" handleClick={xport} />
      </div>
      {/* Render table only if headers and data are valid */}
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
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
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

export default SingleMember;
