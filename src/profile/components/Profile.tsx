import React from "react";
import { Link } from "react-router-dom";

import { Article, formatArticleDate, getAuthorImage } from "../../api/articles";
import { useProfilePage } from "../hooks/useProfilePage";

const Profile = () => {
  const {
    articles,
    errorMessages,
    favoriteSlug,
    handleFavoriteClick,
    handleFollowClick,
    isFavoritesPage,
    isFollowSubmitting,
    isLoading,
    profile,
    username,
  } = useProfilePage();

  const renderArticlePreview = (article: Article) => (
    <div className="article-preview" key={article.slug}>
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
          className={`btn btn-outline-primary btn-sm pull-xs-right${article.favorited ? " active" : ""}`}
          disabled={favoriteSlug === article.slug}
          onClick={() => {
            void handleFavoriteClick(article);
          }}
          type="button"
        >
          <i className="ion-heart" /> {article.favoritesCount}
        </button>
      </div>
      <Link className="preview-link" to={`/${article.slug}`}>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container page">
          <div className="article-preview">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
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
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img alt={profile.username} className="user-img" src={getAuthorImage(profile.image)} />
              <h4>{profile.username}</h4>
              <p>{profile.bio || "This author has not added a bio yet."}</p>
              <button
                className={`btn btn-sm btn-outline-secondary action-btn${profile.following ? " active" : ""}`}
                disabled={isFollowSubmitting}
                onClick={() => {
                  void handleFollowClick();
                }}
                type="button"
              >
                <i className="ion-plus-round" />
                &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
                {typeof profile.followersCount === "number" ? (
                  <span className="counter"> ({profile.followersCount})</span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link className={`nav-link${!isFavoritesPage ? " active" : ""}`} to={`/profile/${username}`}>
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${isFavoritesPage ? " active" : ""}`} to={`/profile/${username}/favorites`}>
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>

            {errorMessages.length > 0 ? (
              <ul className="error-messages">
                {errorMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}

            {articles.length === 0 ? (
              <div className="article-preview">
                {isFavoritesPage ? "No favorited articles are here... yet." : "No articles are here... yet."}
              </div>
            ) : null}

            {articles.map(renderArticlePreview)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
