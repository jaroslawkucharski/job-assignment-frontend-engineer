import React from "react";
import { Redirect, useLocation } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useAuthentication } from "./context/AuthenticationContext";

const LoginRegister = () => {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuthentication();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            {location.pathname === "/register" ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
