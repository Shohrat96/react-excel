// import React from "react";
// import { useFormik } from "formik";
// import { useDispatch } from "react-redux";
// import styles from "./RemarkFilterForm.module.css";


// const RemarkFilterForm = ({ onFilter }) => {

//     return (
//         <>
//             <h2 className={styles.modalTitle}>Filter Remarks</h2>
//             <form onSubmit={formik.handleSubmit}>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="flightNumbers">Flight Numbers (space-separated)</label>
//                     <input
//                         id="flightNumbers"
//                         name="flightNumbers"
//                         type="text"
//                         value={formik.values.flightNumbers}
//                         onChange={formik.handleChange}
//                         className={styles.input}
//                     />
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="startDate">Start Date</label>
//                     <input
//                         id="startDate"
//                         name="startDate"
//                         type="date"
//                         value={formik.values.startDate}
//                         onChange={formik.handleChange}
//                         className={styles.input}
//                     />
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="endDate">End Date</label>
//                     <input
//                         id="endDate"
//                         name="endDate"
//                         type="date"
//                         value={formik.values.endDate}
//                         onChange={formik.handleChange}
//                         className={styles.input}
//                     />
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="authors">Authors (space-separated emails)</label>
//                     <input
//                         id="authors"
//                         name="authors"
//                         type="text"
//                         value={formik.values.authors}
//                         onChange={formik.handleChange}
//                         className={styles.input}
//                     />
//                 </div>
//                 <div className={styles.buttonGroup}>
//                     <button
//                         type="button"
//                         onClick={toggleFilterModal}
//                         className={styles.cancelButton}
//                     >
//                         Cancel
//                     </button>
//                     <button type="submit" className={styles.applyButton}>
//                         Apply
//                     </button>
//                 </div>
//             </form>
//         </>
//     )
// }