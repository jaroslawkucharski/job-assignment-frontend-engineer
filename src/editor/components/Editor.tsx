import React from "react";
import { Redirect } from "react-router-dom";

import AuthenticationErrorMessages from "../../authentication/components/AuthenticationErrorMessages";
import { useAuthentication } from "../../authentication";
import { useEditorForm } from "../hooks/useEditorForm";

const Editor = () => {
  const { isAuthenticated, isBootstrapping } = useAuthentication();
  const {
    body,
    description,
    errorMessages,
    handleSubmit,
    isEditing,
    isLoading,
    isSubmitting,
    setBody,
    setDescription,
    setTagListInput,
    setTitle,
    tagList,
    tagListInput,
    title,
  } = useEditorForm();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errorMessages.length > 0 ? <AuthenticationErrorMessages messages={errorMessages} /> : null}

            {isLoading ? <div className="article-preview">Loading article...</div> : null}

            {!isLoading ? (
              <form onSubmit={(event) => void handleSubmit(event)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      onChange={(event) => {
                        setTitle(event.target.value);
                      }}
                      placeholder="Article Title"
                      type="text"
                      value={title}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      onChange={(event) => {
                        setDescription(event.target.value);
                      }}
                      placeholder="What's this article about?"
                      type="text"
                      value={description}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      onChange={(event) => {
                        setBody(event.target.value);
                      }}
                      placeholder="Write your article (in markdown)"
                      rows={8}
                      value={body}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      onChange={(event) => {
                        setTagListInput(event.target.value);
                      }}
                      placeholder="Enter tags"
                      type="text"
                      value={tagListInput}
                    />
                    <div className="tag-list">
                      {tagList.map((tag) => (
                        <span className="tag-default tag-pill" key={tag}>
                          <i className="ion-close-round" /> {tag}
                        </span>
                      ))}
                    </div>
                  </fieldset>
                  <button className="btn btn-lg pull-xs-right btn-primary" disabled={isSubmitting} type="submit">
                    {isEditing ? "Update Article" : "Publish Article"}
                  </button>
                </fieldset>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
