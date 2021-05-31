import React, { Component } from 'react';
import myimg from '../img/AboutMeRussell.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutRussell extends Component {
  render() {
    return (
      <Container fluid>
        <div className="clearfix">
          <div class="roll aboutroll">
            <h1>ABOUT ME</h1>
            <hr class="myhr" />
          </div>
          <div class="roll contentroll">
            <div class="column imgcol">
              <img class="myimg" src={myimg} alt="Russell" id="mypic" />
            </div>
            <div class="column contentcol">
              <h2>Russell Azucenas</h2>
              <h3>Back-End</h3>
              <p>
                Yo! I'm part of the Back-End team for C's Get Degrees.
                I currently attend San Francsico State.
                I have a few hobbies, but I mainly develop video games.
                </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
export default withRouter(AboutRussell);