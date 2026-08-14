import React from "react";
import { Link } from "react-router-dom";

import { useLoginForm } from "../hooks/useLoginForm";
import AuthenticationErrorMessages from "./AuthenticationErrorMessages";

const LoginForm = () => {
  const { email, errorMessages, handleSubmit, isSubmitting, password, setEmail, setPassword } = useLoginForm();

  return (
    <>
      <h1 className="text-xs-center">Sign in</h1>
      <p className="text-xs-center">
        <Link to="/register">Need an account?</Link>
      </p>

      {errorMessages.length > 0 ? <AuthenticationErrorMessages messages={errorMessages} /> : null}

      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>
        <button className="btn btn-lg btn-primary pull-xs-right" disabled={isSubmitting} type="submit">
          Sign in
        </button>
      </form>
    </>
  );
};

export default LoginForm;
