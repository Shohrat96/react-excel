import React, { useCallback, useRef } from "react";
import styles from "./SingleMember.module.css";
import * as XLSX from "xlsx";
import CustomButton from "../CustomBtn";

const SingleMember = ({ data, headers, member }) => {
  const tableRef = useRef();

  const xport = useCallback(() => {
    /* Create worksheet from HTML DOM TABLE */
    const wb = XLSX.utils.table_to_book(tableRef.current);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, `${member}.xlsx`);
  });

  return (
    <div className={styles.tableContainer}>
      <div>
        <CustomButton title="Export XLSX!" handleClick={xport} />
      </div>
      <table className={styles.flightsTable} ref={tableRef}>
        <thead>
          <tr>
            {Object.values(headers).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SingleMember;
