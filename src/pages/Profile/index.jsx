import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./Profile.module.css";
import { toast } from "react-toastify";
import { changePassword } from "../../api/changePass";
import { useSelector } from "react-redux";

const Profile = () => {
    const email = useSelector((state) => state.root.auth.email);
    const token = useSelector((state) => state.root.auth.token)            
    
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old password is required"),
        newPassword: Yup.string()
            .min(6, "New password must be at least 6 characters long")
            .required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm new password is required"),
    });


    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        console.log("submit values", values);
        
        try {

            const result = await changePassword(token, values.oldPassword, values.newPassword);

            // Show success toast and reset form
            toast.success(result.message);
            resetForm();
        } catch (error) {
            // Show error toast and set form errors
            toast.error(error);
            setErrors({ server: error });
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <h2 className={styles.title}>Change Password</h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="email">User</label>
                            <Field
                                type="email"
                                name="email"
                                disabled
                                value={email}
                                // placeholder={email}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="oldPassword">Old Password</label>
                            <Field
                                type="password"
                                name="oldPassword"
                                autoComplete="new-password"
                                placeholder="Enter old password"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="oldPassword"
                                component="div"
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="newPassword">New Password</label>
                            <Field
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="newPassword"
                                component="div"
                                className={styles.error}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="confirmPassword">Confirm New Password</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className={styles.error}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Changing Password..." : "Change Password"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
