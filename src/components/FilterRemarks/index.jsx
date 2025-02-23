import React, { useEffect, useState } from "react";
import styles from "./FilterRemarks.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredRemarksAsync, getRemarksAsync, resetFilter, selectRemarks, setFilter } from "../../redux/slice/remarkSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "../CustomModal"; // Assuming you have a modal component
import dayjs from "dayjs";
import { getAllRemarkCategories } from "../../api/remarks";


const FilterRemarks = ({ onClose }) => {

    const [categories, setCategories] = useState([]);

    const dispatch = useDispatch();
    const { filter } = useSelector(selectRemarks);

    const handleFilterSubmit = (values) => {
        dispatch(setFilter(values));
        onClose();
    }
    const resetFilterHandler = () => {
        dispatch(resetFilter());
        onClose();
    }


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
    return (
        <CustomModal onClose={onClose}>
            <div className={styles.modalContent}>
                <Formik
                    initialValues={filter}
                    enableReinitialize
                    validationSchema={Yup.object({
                        flightNumber: Yup.string(),
                        flightDateFrom: Yup.date(),
                        flightDateTo: Yup.date(),
                        author: Yup.string(),
                        createdAtFrom: Yup.date(),
                        createdAtTo: Yup.date(),
                        remark: Yup.string(),
                    })}
                    onSubmit={handleFilterSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="flightNumber">
                                    Flight Number
                                </label>
                                <Field name="flightNumber" className={styles.inputField} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Flight Date between:</label>
                                <Field name="flightDateFrom" type="date" className={styles.inputField} />
                                <Field name="flightDateTo" type="date" className={styles.inputField} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="author">
                                    Author
                                </label>
                                <Field name="author" className={styles.inputField} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="category">
                                    Category
                                </label>
                                <Field as="select" name="category" className={styles.inputField}>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.title}>
                                            {category.title}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Created At between: </label>
                                <Field name="createdAtFrom" type="date" className={styles.inputField} />
                                <Field name="createdAtTo" type="date" className={styles.inputField} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="remark">
                                    Remark
                                </label>
                                <Field name="remark" className={styles.inputField} />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.submitButton}>
                                    Apply Filters
                                </button>
                                <button type="button" onClick={resetFilterHandler} className={styles.cancelButton}>
                                    Reset Filters
                                </button>
                                <button type="button" onClick={onClose} className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </CustomModal>
    );
}

export default FilterRemarks;