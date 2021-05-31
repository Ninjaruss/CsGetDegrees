import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import classes from './AboutMe.css';
import Header from '../Layout/Header/Header';
import Footer from '../Layout/Footer/Footer';
import AboutAnh from './Devs/AboutAnh';
import AboutAramis from './Devs/AboutAramis';
import AboutJeans from './Devs/AboutJeans';
import AboutMohamed from './Devs/AboutMohamed';
import AboutRussell from './Devs/AboutRussell';
import AboutTimothy from './Devs/AboutTimothy';

// About me class, handles all the url links for each about page
class AboutMe extends Component {
  render() {
    const { path, url } = this.props.match;
    return (
      <div className="about-me">
        <header className="push-down">
          <Header />
        </header>
        <div className="mybody">
          <Switch>
            <Route path={`${url}/aboutAnh`} component={AboutAnh} />
            <Route path={`${url}/aboutAramis`} component={AboutAramis} />
            <Route path={`${url}/aboutJeans`} component={AboutJeans} />
            <Route path={`${url}/aboutMohamed`} component={AboutMohamed} />
            <Route path={`${url}/aboutRussell`} component={AboutRussell} />
            <Route path={`${url}/aboutTim`} component={AboutTimothy} />
            <Route path={`${url}*`} component={() => <h1 style={{ textAlign: "center" }}>404 NOT FOUND</h1>} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(AboutMe);
