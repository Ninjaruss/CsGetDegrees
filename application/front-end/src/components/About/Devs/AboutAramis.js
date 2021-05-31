import React, { Component } from 'react';
import myimg from '../img/AboutMeAramis.jpg';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class AboutAramis extends Component {
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
              <img className="myimg" src={myimg} alt="Aramis" id="mypic" />
            </div>
            <div classNameName="column contentcol">
              <h2>Aramis</h2>
              <h3>Back End Developer</h3>
              <p>
                Hi! My name is Aramis, and I am a back end developer on this project. When I am not programming or working on
                schoolwork at San Francisco State University, I am usually drawing, running, surfing, or playing guitar. I love
                to create things, and I believe my creativity makes me a stronger software engineer. It inspires me, motivates me,
                and allows me to come up with unique and effective solutions. I am a better programmer because I am creative
                and I am an artist.
                </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(AboutAramis);