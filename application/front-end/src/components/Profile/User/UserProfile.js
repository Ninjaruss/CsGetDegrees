import React, { Component } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Image } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCardFooter, } from "mdbreact";
import { withRouter } from 'react-router-dom';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewProfile: [],
    }
  }

  onMessage = () => {
    this.props.history.push({
      pathname: "/message",
      state: { userid: this.props.location.state.userid },
    });
  }

  // request the user information from server
  getProfile = () => {
    let userid = this.props.location.state.userid;
    axios.all([
      axios.get(`http://34.94.123.246:5000/user/?getUserbyUserid=${userid}`),
      axios.get(`http://34.94.123.246:5000/product/?getAllProductbyUserid=${userid}`)
    ])
      .then(axios.spread((userRes, productRes) => {
        this.viewProfile(userRes.data.data, productRes.data);
      }))
      .catch(err => {
        console.log("getProfile failed")
      })
  }

  // view the profile
  viewProfile = (user, product) => {
    let tempProduct;
    let prodLength;
    if (product.data) {
      prodLength = product.data.length;
      tempProduct = product.data.map(prod => {
        return (
          <MDBCard className="m-2" style={{ width: "15rem" }} cascade ecommerce wide key={prod.pid}        >
            <MDBCardImage cascade top waves onClick={(e) => { e.preventDefault(); }}
              src="https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2664&q=80"
            />
            <MDBCardBody cascade className="text-center"
              // entire card body accept onClick event
              onClick={(e) => {
                e.preventDefault();
                this.onProduct(prod.pid);
              }}
            >
              <MDBCardTitle tag="h6">{prod.category}</MDBCardTitle>
              <MDBCardTitle>
                <a><Button className="btn-block" variant="flat"><strong>{prod.name}</strong></Button></a>
              </MDBCardTitle>
              <MDBCardText>{prod.description}</MDBCardText>
              <MDBCardFooter>
                <span className="float-center font-weight-bold">${prod.price}</span>
              </MDBCardFooter>
            </MDBCardBody>
          </MDBCard>
        )
      })
    } else {
      prodLength = 0;
      tempProduct = <h3>You have no posted any product</h3>
    }
    const tempView =
      <>
        <Container fluid>
          <Row >
            <Col sm={3} className="profile-border">
              <img className="main-img img-fluid rounded-circle" style={{ width: "20rem" }}
                src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
              />
            </Col>
            <Col sm={9} className="user-description">
              <h1 className="font-weight-bold" >{user[0].username}</h1>
              <hr />
              <Row>
                <Col sm={10}>
                  <h4>So far {user[0].username} has {prodLength} products that are on sale. </h4>
                  <br />
                  <p>Contact: {user[0].email}</p>
                  <br />
                </Col>
                <Col sm={2}>
                  <div id="chatButton">
                    <Button variant="outline-success" onClick={this.onMessage}>Open Chat</Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <div className="border-home">
            <Row>
              <h3>You are selling:</h3>
            </Row>
            <Row className="justify-content-center">
              {tempProduct}
            </Row>
          </div>
        </Container >
      </>

    this.setState({ viewProfile: tempView })
  }

  // push to Product when a product in the list was clicked
  onProduct = (pid) => {
    this.props.history.push({
      pathname: "/product",
      state: {
        productId: pid,
      },
    });
  };

  getTempProfile = () => {
    let product = {
      data: [{
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      },
      {
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      },
      {
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      },
      {
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      },
      {
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      }, {
        "category": "Books",
        "product_buyer": null,
        "course": 1,
        "name": "Final Fantasy VI",
        "tags": "Game;Video Game;Final Fantasy;FFVI",
        "price": 60,
        "product_creator": 1,
        "pid": 12,
        "quantity": 6,
        "description": "This is a FF franchise",
      }]
    }
    axios.get(`http://34.94.123.246:5000/user/?getUserbyUserid=${this.props.location.state.userid}`)
      .then(user => {
        this.viewProfile(user.data.data, product.data)
      }).catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.getProfile();
  }

  render() {
    return (
      <div id="profile-body">
        {this.state.viewProfile}
      </div>
    );
  }
}

export default withRouter(UserProfile);