import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from "./RemarksPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRemarksAsync, selectRemarks } from "../../redux/slice/remarkSlice";

const RemarksPage = () => {
    const [expanded, setExpanded] = useState(null);
    const dispatch = useDispatch();
    const remarksState = useSelector(selectRemarks);
    const { remarks } = remarksState;

    const handleExpand = (index) => {
        setExpanded(index === expanded ? null : index);
    };

    useEffect(() => {
        dispatch(getRemarksAsync());
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Remarks</h1>
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
                                <td>{remark.createdAt}</td>
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
                                        {expanded === index ? "-" : "+"}
                                    </button>
                                </td>
                            </tr>
                            {expanded === index && (
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
                                                    {Object.entries(remark.flight_data).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td className={styles.key}>{key}</td>
                                                            <td className={styles.value}>{value}</td>
                                                        </tr>
                                                    ))}
                                                    <tr key={'remark-content'}>
                                                        <td className={styles.key}>Remark</td>
                                                        <td className={styles.value}>{remark.remark}</td>
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
        </div>
    );
};

export default RemarksPage;
