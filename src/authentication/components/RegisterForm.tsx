import React from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <>
      <h1 className="text-xs-center">Sign up</h1>
      <p className="text-xs-center">
        <Link to="/login">Have an account?</Link>
      </p>

      <form>
        <fieldset className="form-group">
          <input className="form-control form-control-lg" type="text" placeholder="Your Name" />
        </fieldset>
        <fieldset className="form-group">
          <input className="form-control form-control-lg" type="text" placeholder="Email" />
        </fieldset>
        <fieldset className="form-group">
          <input className="form-control form-control-lg" type="password" placeholder="Password" />
        </fieldset>
        <button className="btn btn-lg btn-primary pull-xs-right" type="button">
          Sign up
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
