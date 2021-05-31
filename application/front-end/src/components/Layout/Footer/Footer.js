import React, { Component } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import classes from './Footer.css';

// Footer class, manages footer and urls to about pages
class Footer extends Component {

  render() {
    return (
      <div className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>
              <a href="/"><i className="fas fa-graduation-cap" /> CsGetDegrees</a>
            </h2>
            <hr />
            <p>
              Where students at San Francisco State can sell, purchase, or browse for items and or services.
           </p>

          </div>
          <div className="footer-section links">
            <h2>Developers</h2>
            <hr />
            <ul>
              <a href="../../about/aboutAnh"><li>Anh - Team Lead</li></a>
              <a href="../../about/aboutAramis"><li>Aramis - Backend Lead</li></a>
              <a href="../../about/aboutJeans"><li>YeeJian - Frontend Lead</li></a>
              <a href="../../about/aboutMohamed"><li>Mohamed - Frontend</li></a>
              <a href="../../about/aboutRussell"><li>Russell - Backend</li></a>
              <a href="../../about/aboutTim"><li>Timothy - Backend</li></a>
            </ul>

          </div>
          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <div className="contact">
              <hr />
              <span><i class="fas fa-phone"> &nbsp;123-456-789</i></span>
              <span><i class="fas fa-envelope"> &nbsp;info@CsGetDegrees.com</i></span>
            </div>
            <p>Address: 1600 Holloway Ave, San Francisco, CA 94132</p>
          </div>
          <div className="footer-bottom">
            &copy;{new Date().getFullYear()} CsGetDegrees | Designed By SFSU Students
            </div>
        </div>
      </div>

    );
  }
}

export default withRouter(Footer);