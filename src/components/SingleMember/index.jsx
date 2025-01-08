import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import styles from "./SingleMember.module.css";
import CustomButton from "../CustomBtn";
import { FLIGHT_TABLE_HEADERS } from "../../types/constants";
import { formatTAFData } from "../../utils/formatTAFdata";
import { FaEdit } from "react-icons/fa";
import CustomModal from "../CustomModal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FlightsTable = ({ data, headers, member }) => {
  const [showNAJOnly, setShowNAJOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleSubmit = (values) => {
    // const payload = {
    //     flight_number: flightNumber,
    //     flight_date: cellValue,
    //     user_email: userEmail,
    //     remark: values.remark,
    //     insertion_date: new Date().toISOString(),
    //     update_date: new Date().toISOString(),
    // };

    // Replace this with your API call to save the data to the database
    console.log("Submitting payload:");
    toggleModal();
  };
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

                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.date
                  ) {
                    return <td key={value} className={styles.dateCell}>
                      <div className={styles.cellValue}>
                        {cellValue}
                        <div className={styles.iconWrapper} onClick={toggleModal}>
                          <FaEdit
                            className={styles.editIcon}
                            title="Add Remark"
                            color="#2c3e50"
                          />
                        </div>
                      </div>
                    </td>;
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

      {isModalOpen && (
        <CustomModal onClose={toggleModal}>
          <div className={styles.modalContent}>
            <h3>Add Remark</h3>
            <Formik
              initialValues={{ remark: "" }}
              validationSchema={Yup.object({
                remark: Yup.string()
                  .required("Remark is required")
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className={styles.formGroup}>
                    <label htmlFor="remark">Remark</label>
                    <Field
                      name="remark"
                      as="textarea"
                      className={styles.textArea}
                    />
                    <ErrorMessage
                      name="remark"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default FlightsTable;
