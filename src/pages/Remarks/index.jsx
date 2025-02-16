import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from "./RemarksPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRemarksAsync, selectRemarks, setCurrentPage } from "../../redux/slice/remarkSlice";
import { getAllRemarks } from "../../api/remarks";
import dayjs from "dayjs";

const RemarksPage = () => {
    const [expanded, setExpanded] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const remarksState = useSelector(selectRemarks);
    const { remarks, currentPage, totalPages } = remarksState;

    const handleExpand = (index) => {
        setExpanded(expanded?.includes(index) ? expanded.filter(item => item !== index) : [...expanded, index]);
    };

    // const fetchRemarks = async (page = 1) => {
    //     setLoading(true);
    //     try {
    //         const response = await getAllRemarks(page); // Fetch remarks with pagination
    //         setTotalPages(response.totalPages); // Set total pages from API response
    //         dispatch(getRemarksAsync(response.remarks)); // Dispatch remarks to Redux
    //     } catch (error) {
    //         console.error("Error fetching remarks:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page)); // Set current page in Redux
        // fetchRemarks(page); // Fetch remarks for selected page
    };

    useEffect(() => {
        dispatch(getRemarksAsync(currentPage));
    }, [currentPage]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Remarks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Flight Number</th>
                                <th>Flight Date</th>
                                <th>Author</th>
                                <th>Created At</th>
                                <th>Remark</th>
                                <th>Detailed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remarks?.map((remark, index) => (
                                <React.Fragment key={index}>
                                    <tr className={styles.primaryRow}>
                                        <td>{remark.flight_number}</td>
                                        <td>{remark.flight_date}</td>
                                        <td>{remark.author}</td>
                                        <td>{dayjs(remark.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td title={remark.remark}>
                                            {remark.remark.length > 50
                                                ? `${remark.remark.slice(0, 30)}...`
                                                : remark.remark}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.expandButton}
                                                onClick={() => handleExpand(index)}
                                            >
                                                {expanded.includes(index) ? "-" : "+"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded.includes(index) && (
                                        <tr className={styles.detailsRow}>
                                            <td colSpan="6">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className={styles.expandableContent}
                                                >
                                                    <table className={styles.detailsTable}>
                                                        <tbody>
                                                            {Object.entries(
                                                                remark.flight_data
                                                            ).map(([key, value]) => (
                                                                <tr key={key}>
                                                                    <td className={styles.key}>{key}</td>
                                                                    <td className={styles.value}>{`${value}`}</td>
                                                                </tr>
                                                            ))}
                                                            <tr key={"remark-content"}>
                                                                <td className={styles.key}>Remark</td>
                                                                <td className={styles.value}>
                                                                    {remark.remark}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Component */}
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageButton}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className={styles.pageButton}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RemarksPage;
