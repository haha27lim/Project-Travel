import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";
import '../styles/components/Register.css';
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [, setIsGoogleRedirect] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    setIsGoogleRedirect(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  useEffect(() => {
    const handlePopState = () => {
      setIsGoogleRedirect(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val) => Boolean(val && val.length >= 3 && val.length <= 20)
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) => Boolean(val && val.length >= 6 && val.length <= 40)
      )
      .required("This field is required!"),
  });


  const handleRegister = (formValue: { username: string; email: string; password: string }) => {
    const { username, email, password } = formValue;

    setMessage("");
    setSuccessful(false);

    AuthService.register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [navigate, isAuthenticated]);

  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <Link to="/" className="back-button">
            <ArrowLeft className="button-icon" />
            Back to Home
          </Link>

          <h2 className="auth-title">Create Account</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <button
                      type="button"
                      onClick={handleGoogleSignup}
                      className="google-login-button"
                    >
                      <img
                        src="/google-icon.svg"
                        alt="Google"
                        className="google-icon"
                      />
                      Sign up with Google
                    </button>
                  </div>

                  <div className="or-login-with">Or sign up with</div>

                  <div className="form-group">
                    <label htmlFor="username"> Username </label>
                    <Field name="username" type="text" className="form-control" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"> Email </label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password"> Password </label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="submit-button">
                      <UserPlus className="button-icon" />
                      Register
                    </button>

                    <div className="auth-links">
                      Already have an account?{' '}
                      <Link to="/login" className="auth-link">Sign in</Link>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
