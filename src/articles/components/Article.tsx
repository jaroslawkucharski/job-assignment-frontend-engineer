import React from "react";
import { Link } from "react-router-dom";

import { Article as ArticleData, formatArticleDate, getAuthorImage } from "../../api/articles";
import { useArticlePage } from "../hooks/useArticlePage";

const Article = () => {
  const {
    article,
    errorMessages,
    handleFavoriteClick,
    handleFollowClick,
    isFavoriteSubmitting,
    isFollowSubmitting,
    isLoading,
  } = useArticlePage();

  const renderArticleActions = (article: ArticleData) => (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img alt={article.author.username} src={getAuthorImage(article.author.image)} />
      </Link>
      <div className="info">
        <Link className="author" to={`/profile/${article.author.username}`}>
          {article.author.username}
        </Link>
        <span className="date">{formatArticleDate(article.createdAt)}</span>
      </div>
      <button
        className={`btn btn-sm btn-outline-secondary${article.author.following ? " active" : ""}`}
        disabled={isFollowSubmitting}
        onClick={() => {
          void handleFollowClick();
        }}
        type="button"
      >
        <i className="ion-plus-round" />
        &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
      </button>
      &nbsp;
      <button
        className={`btn btn-sm btn-outline-primary${article.favorited ? " active" : ""}`}
        disabled={isFavoriteSubmitting}
        onClick={() => {
          void handleFavoriteClick();
        }}
        type="button"
      >
        <i className="ion-heart" />
        &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Article{" "}
        <span className="counter">({article.favoritesCount})</span>
      </button>
    </div>
  );

  const renderArticleBody = (body: string) =>
    body.split(/\n+/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>);

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="article-preview">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page">
        <div className="container page">
          {errorMessages.length > 0 ? (
            <ul className="error-messages">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          {renderArticleActions(article)}
        </div>
      </div>

      <div className="container page">
        {errorMessages.length > 0 ? (
          <ul className="error-messages">
            {errorMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}

        <div className="row article-content">
          <div className="col-md-12">
            {renderArticleBody(article.body)}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          {renderArticleActions(article)}
        </div>
      </div>
    </div>
  );
};

export default Article;
