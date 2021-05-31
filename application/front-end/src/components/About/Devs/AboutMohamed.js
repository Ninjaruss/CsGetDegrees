import React, { Component } from 'react';
import myimg from '../img/AboutMeMohamed.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutMohamed extends Component {
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
              <img class="myimg" src={myimg} alt="Mohamed" id="mypic" />
            </div>
            <div class="column contentcol">
              <h2>Mohamed Farah</h2>
              <h3>Front-End</h3>
              <p>
                Hi!! I go by Mohamed, I am a Front-End who currently attends San
                Francisco State. I have many hobbies, one of which is staring at
                clouds &#9729;
          </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(AboutMohamed);