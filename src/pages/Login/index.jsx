import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.root.auth.token);
    const loading = useSelector((state) => state.root.auth.loading);
    const error = useSelector((state) => state.root.auth.error); // Get the error message

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(login(values)); // Dispatch login action with form values
        },
    });

    // const handleSubmit = (values) => {
    //     dispatch(login({ email: values.email }));
    //     navigate("/");
    // };

    useEffect(() => {
        if (token) {
            navigate("/"); // Navigate only if token exists
        }
    }, [token, navigate]);

    return (
        <div className={styles.container}>
            <form onSubmit={formik.handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={styles.input}
                    />
                    {formik.touched.email && formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={styles.input}
                    />
                    {formik.touched.password && formik.errors.password && <div className={styles.error}>{formik.errors.password}</div>}
                </div>

                {error && <div className={styles.error}>{error}</div>}


                <button disabled={loading} type="submit" className={styles.button}>{loading ? "Submiting..." : "Submit"}</button>
            </form>
        </div>
    );
};

export default Login;
