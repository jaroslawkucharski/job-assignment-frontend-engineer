import React from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuthentication } from "../../authentication";

const Navigation = () => {
  const { isAuthenticated } = useAuthentication();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/editor">
              <i className="ion-compose" />
              &nbsp;New Article
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/settings">
              <i className="ion-gear-a" />
              &nbsp;Settings
            </NavLink>
          </li>
          {isAuthenticated ? (
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/logout">
                Logout
              </NavLink>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/login">
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/register">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
