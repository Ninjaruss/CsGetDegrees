import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Col, Row, Container, } from 'react-bootstrap';
import classes from './Profile.css'
import UserProfile from './User/UserProfile';
import SellerProfile from './Seller/SellerProfile';
import ProtectedRoute from '../../ProtectedRoute';
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer"
import SidePanel from '../Layout/SidePanel/SidePanel';

import serverGod from './motto/Server the God.jpg';
import smoke from './motto/Smoke Weeb Everday.jpg';
import snowy from './motto/Stain Snowy.mp4';
import squish from './motto/SQUISH THAT CAT.mp4';
import waltz from './motto/Car slinging to Waltz of the Flowers_Large.mp4';

class Profile extends Component {
  render() {
    const { path, url } = this.props.match;
    return (
      <div className="profile">
        <header className="push-down">
          <Header />
        </header>
        <div className="classes">
          <Row>
            <Col md={10}>
              <Switch>
                <Route path={`${url}/seller`} component={SellerProfile} />
                <ProtectedRoute path={`${url}/user`} component={UserProfile} />
                <Route path={`${url}/motto`} component={mottoProfile} />
                <Route path={`${url}*`} component={() => <h1 style={{ textAlign: "center" }}>404 NOT FOUND</h1>} />
              </Switch>
            </Col>
            <Col md={2}>
              <SidePanel />
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

// this is an easter egg
class mottoProfile extends Component {
  render() {
    return (
      <Container fluid style={{ padding: "2rem 1rem" }}>
        <h1>Our Motto is GetC'sDegree</h1>
        <h2>Celebrating mediocrity</h2>
        <hr />
        <Row>
          <Col md={6}>
            <img width="500rem" src={serverGod} alt="Server the God.jpg" />
          </Col>
          <Col md={6}>
            <br />
            <h3>Server, The God</h3>
            <hr />
            <p>We pray to our server</p>
            <p>Day and night</p>
          </Col>
        </Row>
        <hr />
        <h4>The semester is hard, but we never go down without slinging to the 'Waltz of the Flowers'</h4>
        <video width="700rem" controls src={waltz} type="video/mp4">></video>
        <hr />
        <Row>
          <Col md={2}>
            <h5>We never</h5>
          </Col>
          <Col md={3}>
            <img width="300rem" src={smoke} alt="Smoke Weeb Everday.jpg" />
          </Col>
          <Col md={2}>
            <h4>, but we</h4>
          </Col>
          <Col md={5}>
            <video width="400rem" controls src={squish} type="video/mp4">></video>
          </Col>
        </Row>
        <hr />
        <h4>Anyway,</h4>
        <h2>Life Goes On</h2>
        <br />
        <video width="700rem" controls src={snowy} type="video/mp4" loop></video>
      </Container>
    )
  }
}

export default withRouter(Profile);
