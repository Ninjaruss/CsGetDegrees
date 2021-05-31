import React, { Component } from 'react';
import myimg from '../img/AboutMeJeans.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutJeans extends Component {
  render() {
    return (
      <Container fluid>
        <div className="clearfix">
          <div className="roll aboutroll">
            <h1>ABOUT ME</h1>
            <hr className="myhr" />
          </div>
          <div className="roll contentroll">
            <div className="column imgcol">
              <img className="myimg" src={myimg} alt="YeeJian" id="mypic" />
            </div>
            <div className="column contentcol">
              <h2>YeeJian Tan</h2>
              <h3>Front End Lead & Github Master</h3>
              <p>
                Hi! My Name is YeeJian Tan, born and raised in Malaysia. I am currently enrolled in San Francisco State University as a
                Computer Science student.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
export default withRouter(AboutJeans);