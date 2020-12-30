import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import AuthNavbar from "./Navbars/AuthNavbar.jsx";
import routes from "../../routes.js";
import bgImage from "../../assets/img/full-screen-image-3.jpg";

class Pages extends Component {
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }

  getPageClass() {
    let pageClass = "";
    switch (this.props.location.pathname) {
      case "/login":
        pageClass = " login";
        break;
      // case "/register":
      //   pageClass = " register";
      //   break;
      default:
        pageClass = "";
        break;
    }
    return pageClass;
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.path === "/login") {
        return (
          <Route
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  render() {
    return (
      <div>
        <AuthNavbar />
        <div className="wrapper wrapper-full-page">
          <div
            className={"full-page" + this.getPageClass()}
            data-color="black"
            data-image={bgImage}
          >
            <div className="content">
              <Switch>{this.getRoutes(routes)}</Switch>
            </div>
            <div
              className="full-page-background"
              style={{ backgroundImage: "url(" + bgImage + ")" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Pages;
