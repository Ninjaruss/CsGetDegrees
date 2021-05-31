import React, { Component } from 'react';
import myimg from '../img/AboutMeAnh.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutAnh extends Component {
  render() {
    return (
      <Container fluid>
        <div className="clearfix">
          <div className="roll aboutroll">
            <h1>ABOUT ME</h1>
            <hr className="myhr"/>
          </div>
          <div className="roll contentroll">
            <div className="column imgcol">
              <img className="myimg" src={myimg} alt="BringitOn" id="mypic" />
            </div>
            <div className="column contentcol">
              <h2>Anh Le</h2>
              <h3>Team Lead</h3>
              <p>
                Hello! My name is Anh! Currently a senior at SFSU. I was born in Vietnam and immigrated to the U.S. in early 2000s. I grew up in the Bay Area for most of my life and graduated from South San Francisco High.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
export default withRouter(AboutAnh);
