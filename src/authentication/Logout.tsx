import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

import { useAuthentication } from "./context/AuthenticationContext";

const Logout = () => {
  const { logout } = useAuthentication();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Redirect to="/" />;
};

export default Logout;
