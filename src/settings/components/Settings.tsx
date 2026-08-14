import React from "react";
import { Redirect } from "react-router-dom";

import AuthenticationErrorMessages from "../../authentication/components/AuthenticationErrorMessages";
import { useAuthentication } from "../../authentication";
import { useSettingsForm } from "../hooks/useSettingsForm";

const Settings = () => {
  const { isAuthenticated, isBootstrapping } = useAuthentication();
  const { bio, email, errorMessages, handleSubmit, image, isSubmitting, password, setBio, setEmail, setImage, setPassword, setUsername, username } =
    useSettingsForm();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {errorMessages.length > 0 ? <AuthenticationErrorMessages messages={errorMessages} /> : null}

            <form onSubmit={(event) => void handleSubmit(event)}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    onChange={(event) => {
                      setImage(event.target.value);
                    }}
                    placeholder="URL of profile picture"
                    type="text"
                    value={image}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                    placeholder="Your Name"
                    type="text"
                    value={username}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    onChange={(event) => {
                      setBio(event.target.value);
                    }}
                    placeholder="Short bio about you"
                    rows={8}
                    value={bio}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    placeholder="Email"
                    type="text"
                    value={email}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    placeholder="Password"
                    type="password"
                    value={password}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" disabled={isSubmitting} type="submit">
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <a className="btn btn-outline-danger" href="/#/logout">
              Or click here to logout.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
