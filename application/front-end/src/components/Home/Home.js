import React, { Component } from "react";
import { Button, Container, Row, Col, Carousel } from "react-bootstrap";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCardFooter, } from "mdbreact";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import SidePanel from "../Layout/SidePanel/SidePanel";

// Home class manages home page
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      queries: "all",
      categories: "all",
      recentList: [],
    };
  }
  // gets recent items that were uploaded
  getRecentListing = () => {
    axios.get(`http://34.94.123.246:5000/search/?queries=9Recent`).
      then(res => {
        this.viewRecentListing(res.data);
      }).catch(err => {
        console.log("9recent failed");
        console.log(err);
      });
  };
  // handles how recents are viewed
  viewRecentListing = products => {
    const temp = products.data.map((prod) => {
      return (
        <MDBCard className="m-2" style={{ width: "22rem" }} cascade ecommerce wide key={prod.pid}        >
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
      );
    });
    this.setState({ recentList: temp });
  }

  // push to Product when a product in the list was clicked
  onProduct = (pid) => {
    console.log("In Home onProduct pid: " + pid);
    this.props.history.push({
      pathname: "/product",
      state: {
        productId: pid,
      },
    });
  };

  componentDidMount() {
    this.getRecentListing();
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-wrapper">
          <header className="push-down">
            <Header />
          </header>
          <Container fluid>
            <Row>
              <Col>
                <Row className="row-center">
                  <Col sm={10} className="centerCol">
                    <Carousel>
                      <Carousel.Item>
                        <img
                          className="d-block w-100 home-img"
                          src="https://s26162.pcdn.co/wp-content/uploads/2019/07/used-books-store-2.jpg"
                          alt="First slide"
                        />
                        <Carousel.Caption>
                          <h3>Textbooks</h3>
                          <p>New And Used Books</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100 home-img"
                          src="https://images.theconversation.com/files/268439/original/file-20190409-2921-1a4uike.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&h=501&fit=crop&dpr=1"
                          alt="Third slide"
                        />
                        <Carousel.Caption>
                          <h3>Tutoring</h3>
                          <p>Teach and Learn from Students at SFSU</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100 home-img"
                          src="https://moving.bedbathandbeyond.com/wp-content/uploads/2015/11/ThinkstockPhotos-104698236.jpg"
                          alt="Third slide"
                        />
                        <Carousel.Caption>
                          <h3>Other Items</h3>
                          <p>SFSU Students can sell any items through CsGetDegrees</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </Col>
                </Row>
                <br />
                <Row className="justify-content-center border-home">{this.state.recentList}</Row>
                <br />
              </Col>
              <Col sm={2}>
                <SidePanel />
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Home);
