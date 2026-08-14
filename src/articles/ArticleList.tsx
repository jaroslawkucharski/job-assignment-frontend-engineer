import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Article, favoriteArticle, formatArticleDate, getArticles, getAuthorImage, unfavoriteArticle } from "../api/articles";
import { useAuthentication } from "../authentication";

const ArticleList = () => {
  const history = useHistory();
  const { token } = useAuthentication();

  const [state, setState] = useState({
    articles: [] as Article[],
    errorMessages: [] as string[],
    favoriteSlug: "",
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    getArticles(token)
      .then((articles) => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          articles,
          isLoading: false,
        }));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          errorMessages: ["Unable to load articles."],
          isLoading: false,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleFavoriteClick = async (article: Article): Promise<void> => {
    if (!token) {
      history.push("/login");
      return;
    }

    setState((currentState) => ({
      ...currentState,
      favoriteSlug: article.slug,
    }));

    try {
      const nextArticle = article.favorited
        ? await unfavoriteArticle(article.slug, token)
        : await favoriteArticle(article.slug, token);

      setState((currentState) => ({
        ...currentState,
        articles: currentState.articles.map((currentArticle) =>
          currentArticle.slug === article.slug ? nextArticle : currentArticle
        ),
        favoriteSlug: "",
      }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        errorMessages: ["Unable to update favorite article."],
        favoriteSlug: "",
      }));
    }
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <span className="nav-link disabled">Your Feed</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link active">Global Feed</span>
                </li>
              </ul>
            </div>

            {state.errorMessages.length > 0 ? (
              <ul className="error-messages">
                {state.errorMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}

            {state.isLoading ? <div className="article-preview">Loading articles...</div> : null}

            {!state.isLoading && state.articles.length === 0 ? (
              <div className="article-preview">No articles are here... yet.</div>
            ) : null}

            {state.articles.map((article) => (
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
                    disabled={state.favoriteSlug === article.slug}
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
            ))}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                <a href="" className="tag-pill tag-default">
                  programming
                </a>
                <a href="" className="tag-pill tag-default">
                  javascript
                </a>
                <a href="" className="tag-pill tag-default">
                  emberjs
                </a>
                <a href="" className="tag-pill tag-default">
                  angularjs
                </a>
                <a href="" className="tag-pill tag-default">
                  react
                </a>
                <a href="" className="tag-pill tag-default">
                  mean
                </a>
                <a href="" className="tag-pill tag-default">
                  node
                </a>
                <a href="" className="tag-pill tag-default">
                  rails
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
