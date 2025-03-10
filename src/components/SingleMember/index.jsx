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
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../redux/slice/authSlice";
import { addRemarksAsync } from "../../redux/slice/remarkSlice";
import { getAllRemarkCategories } from "../../api/remarks";


const FlightsTable = ({ data, headers, member }) => {
  // const [showNAJOnly, setShowNAJOnly] = useState(false);
  const [selectedFlightForRemark, setSelectedFlightForRemark] = useState(null)
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const { email } = useSelector(selectAuth);

  const dispatch = useDispatch();


  const toggleModal = (flight) => {
    if (!isModalOpen) {
      setSelectedFlightForRemark(flight)
    } else {
      setSelectedFlightForRemark(null)
      setIsOtherCategory(false);
    }
    setIsModalOpen(!isModalOpen);
  };
  const handleSubmit = (remarkValue) => {
    dispatch(addRemarksAsync({ remark: remarkValue.remark, category: remarkValue.category, customCategory: remarkValue?.customCategory, flight_number: selectedFlightForRemark.flight_number, flight_date: selectedFlightForRemark.date, flight_data: selectedFlightForRemark, author: email }));
    toggleModal();
  };

  // const handleDestinationFilter = (e) => {
  //   const options = Array.from(e.target.selectedOptions).map((option) => option.value);
  //   setSelectedDestinations(options);
  // };

  const tableRef = useRef();

  // Function to toggle the NAJ filter
  // const toggleNAJFilter = () => {
  //   setShowNAJOnly((prev) => !prev);
  // };

  // fetch remark categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllRemarkCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error getting categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Export to XLSX
  // const xport = useCallback(() => {
  //   if (!tableRef.current) return;
  //   const wb = XLSX.utils.table_to_book(tableRef.current);
  //   XLSX.writeFile(wb, `${member}.xlsx`);
  // }, [member]);
  const xport = useCallback(() => {
    if (!data || data.length === 0) return;

    // Create a new array of objects with only the necessary data
    const formattedData = data.map((row) => {
      const newRow = {};
      Object.keys(headers).forEach((key) => {
        newRow[headers[key]] = row[key];
      });
      return newRow;
    });

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Flights Data");

    // Export the Excel file
    XLSX.writeFile(workbook, `${member}.xlsx`);
  }, [data, headers, member]);

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
                  const cellValue = row?.[value] || "";
                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEP ||
                    headers[value] === FLIGHT_TABLE_HEADERS.TAF_DEST
                  ) {
                    return <td key={value}>{formatTAFData(cellValue)}</td>;
                  }

                  // if (
                  //   headers[value] === FLIGHT_TABLE_HEADERS.origin ||
                  //   headers[value] === FLIGHT_TABLE_HEADERS.destination
                  // ) {
                  //   return (
                  //     <td
                  //       key={value}
                  //       style={{ cursor: "pointer" }}
                  //       onClick={() => {
                  //         const url = `/jeppesen/${cellValue}`; // Validate the value before using it in a URL
                  //         if (cellValue) {
                  //           window.open(url, "_blank");
                  //         } else {
                  //           console.error("Invalid cell value for URL:", cellValue);
                  //         }
                  //       }}
                  //     >
                  //       {cellValue}
                  //     </td>
                  //   );
                  // }

                  if (
                    headers[value] === FLIGHT_TABLE_HEADERS.date
                  ) {
                    return <td key={value} className={styles.dateCell}>
                      <div className={styles.cellValue}>
                        {cellValue}
                        <div className={styles.iconWrapper} onClick={() => toggleModal(row)}>
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
              initialValues={{ remark: "", category: "", customCategory: "" }}
              validationSchema={Yup.object({
                remark: Yup.string()
                  .required("Remark is required"),
                category: Yup.string()
                  .required("Category is required"),

                customCategory: Yup.string().when("category", (category, schema) => {
                  return category[0] === "OTHER" ? schema.required("Note is required") : schema.notRequired();
                }),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => {

                return (
                  <Form>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="remark">Remark</label>
                      <Field
                        name="remark"
                        autoFocus
                        as="textarea"
                        className={styles.textArea}
                      />
                      <ErrorMessage
                        name="remark"
                        component="div"
                        className={styles.error}
                      />

                      {/* Dropdown for Category */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="category">Category</label>
                        <Field
                          name="category"
                          as="select"
                          className={styles.select}
                        // onChange={(e) => {
                        //   setIsOtherCategory(e.target.value === "OTHER")
                        // }}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.title}>
                              {category.title}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className={styles.error}
                        />
                      </div>

                      {values?.category === "OTHER" && (
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel} htmlFor="customCategory">Custom Category</label>
                          <Field
                            name="customCategory"
                            type="text"
                            as="textarea"
                            className={styles.textArea}
                            placeholder="Enter custom category"
                          />
                          <ErrorMessage
                            name="customCategory"
                            component="div"
                            className={styles.error}
                          />
                        </div>
                      )}

                    </div>
                    <button
                      type="submit"
                      className={styles.submitButton}
                    >
                      Submit
                    </button>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default FlightsTable;
