import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { Article, ArticleList } from "./articles";
import { Footer } from "./components/footer";
import { Navigation } from "./components/navigation";
import Editor from "./Editor";
import { AuthenticationProvider, LoginRegister, Logout } from "./authentication";
import Profile from "./Profile";
import Settings from "./Settings";

function App() {
  return (
    <AuthenticationProvider>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/editor" exact component={Editor} />
          <Route path="/editor/:slug" exact component={Editor} />
          <Route path="/login" exact component={LoginRegister} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/profile/:username" exact component={Profile} />
          <Route path="/profile/:username/favorites" exact component={Profile} />
          <Route path="/register" exact component={LoginRegister} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/:slug" exact component={Article} />
          <Route path="/" component={ArticleList} />
        </Switch>
        <Footer />
      </Router>
    </AuthenticationProvider>
  );
}

export default App;
