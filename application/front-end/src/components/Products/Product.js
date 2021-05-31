import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Row, Container, Badge, FormControl } from "react-bootstrap";
import axios from "axios";
import Cookies from 'universal-cookie';
import classes from './Product.css';
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import SidePanel from "../Layout/SidePanel/SidePanel";

// Product page for individual products
class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }

  // get the product when component did mount
  getProduct = () => {
    axios.all([
      axios.get(`http://34.94.123.246:5000/product/?getProductbyProductid=${this.props.location.state.productId}`),
      axios.get(`http://34.94.123.246:5000/user/?getUserbyProductid=${this.props.location.state.productId}`)
    ])
      .then(axios.spread((productRes, userRes) => {
        this.viewProduct(userRes.data.data, productRes.data.data);
      }))
      .catch(err => {
        console.log(err)
      });

  };


  // view the product after getting response
  viewProduct = (user, product) => {
    const temp =
      <>
        <Row >
          <Col sm={7}>
            <img className="main-img img-fluid" src="https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2664&q=80" alt={product[0].name} />
          </Col>
          <Col sm={5} >
            <div >
              <br />
              <div className="mb-3">
                <Badge pill variant="primary" style={{ size: "150%" }}>{product[0].category}</Badge>
              </div>
              <br />
              <h1>{product[0].name}</h1>
              <Button variant="light"
                onClick={(e) => { this.onSellerProfile(e, product[0].product_creator) }}
                style={{ textAlign: "left", fontSize: "150%", paddingLeft: 0 }}
              >
                {user[0].username}
              </Button>
              <p><i>{user[0].email}</i></p>
              <hr />
              <Row id="product-des">
                <Col md={2} id="product-des">
                  <p>Price</p>
                </Col>
                <Col md={1}>
                  <p>:</p>
                </Col>
                <Col>
                  <p id="price">{product[0].price}USD</p>
                </Col>
              </Row>
              <Row id="product-des">
                <Col md={2} id="product-des">
                  <p>Department</p>
                </Col>
                <Col md={1}>
                  <p>:</p>
                </Col>
                <Col>
                  <p>{product[0].department}</p>
                </Col>
              </Row>
              <Row id="product-des">
                <Col md={2} id="product-des">
                  <p>Course</p>
                </Col>
                <Col md={1}>
                  <p>:</p>
                </Col>
                <Col>
                  <p>{product[0].course}</p>
                </Col>
              </Row>
              <Row id="product-des">
                <Col md={2} id="product-des">
                  <p>Quantity</p>
                </Col>
                <Col md={1}>
                  <p>:</p>
                </Col>
                <Col>
                  <p>{product[0].quantity}</p>
                </Col>
              </Row>
              <Row id="product-des">
                <Col md={2} id="product-des">
                  <p>Description</p>
                </Col>
                <Col md={1}>
                  <p>:</p>
                </Col>
                <Col>
                  <p>{product[0].description}</p>
                </Col>
              </Row>

            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <div id="btn-buy">
            <Button variant="warning" onClick={(e) => { this.onPurchase(e, user[0], product[0]) }}><i className="fas fa-shopping-cart"></i> Buy Now </Button>
          </div>
        </Row>
      </>

    this.setState({ list: temp });
  }

  // push to transaction to purchase the product when button clicked
  onPurchase = (e, user, product) => {
    e.preventDefault();
    this.props.history.push({
      pathname: "/transaction",
      state: {
        user: user,
        product: product,
      }
    });
  }

  // push to seller profile
  onSellerProfile = (e, sellerid) => {
    e.preventDefault();
    const cookies = new Cookies();
    let userid = cookies.get("userid");
    this.props.history.push({
      pathname: "/profile/seller",
      state: {
        userid: userid,
        sellerid: sellerid,
      }
    });
  }

  getTempProduct = () => {
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
      }]
    }
    let user = {
      data: [{
        "uid": "1",
        "email": "demo@mail.com",
        "username": "John Smith",
      }]
    }
    this.viewProduct(user.data, product.data);
  }

  componentDidMount() {
    this.getProduct();
  }

  render() {
    return (
      <div className="Product page-container">
        <div className="page-wrapper">
          <div className="push-down">
            <Header />
          </div>
          <Container fluid style={{ padding: "2rem 0" }}>
            <Row>
              <Col sm={10} className="border-home" style={{ padding: "1rem 0" }}>
                {this.state.list}
              </Col>
              <Col sm={2}>
                <SidePanel />
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div >

    );
  }
}
export default withRouter(Products);