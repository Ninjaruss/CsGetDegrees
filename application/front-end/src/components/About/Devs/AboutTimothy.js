import React, { Component } from 'react';
import myimg from '../img/AboutMeTim.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutTimothy extends Component {
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
              <img class="myimg" src={myimg} alt="Timothy" id="mypic" />
            </div>
            <div class="column contentcol">
              <h2>Timothy</h2>
              <h3>Back End Developer</h3>
              <p>
                Hi I'm Tim, 23, and a CS major with a minor in Mathematics. I'm
                on the back-end!
                </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
export default withRouter(AboutTimothy);