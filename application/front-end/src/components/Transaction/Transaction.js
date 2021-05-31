import React, { Component } from "react";
import { Button, Badge, Container, Form, FormControl, FormLabel, FormGroup, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';
import Header from "../Layout/Header/Header";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      price: 0
    }
  }

  // convert params to www-form-urlencoded format
  getParams = (obj) => {
    const params = new URLSearchParams();
    const keys = Object.keys(obj);
    for (let k of keys) {
      params.append(k, obj[k]);
    }
    return params;
  }

  // view the product after getting response
  viewProduct = () => {
    let product = this.props.location.state.product;
    let user = this.props.location.state.user;
    this.setState({
      price: product.price,
      list: [
        <Row>
          <Col sm={4}>
            <img className="main-img img-fluid" src="https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2664&q=80" alt={product.name} />
          </Col>
          <Col sm={6} style={{padding: "1rem 0"}}>
            <Row>
              <h1>{product.name}</h1>
            </Row>
            <Row>
              <Button variant="light"
                onClick={(e) => { this.onSellerProfile(e, product.product_creator) }}
                style={{ textAlign: "left", fontSize: "120%", paddingLeft: 0 }}
              >
                {user.username}
              </Button>
            </Row>
            <Row>
              <p><i className="fas fa-envelope">{user.email}</i></p>
            </Row>
          </Col>
        </Row>
      ]
    })
  }

  // purchase product when button clicked
  onPurchase = e => {
    e.preventDefault();
    console.log("Purchase onPurchase")
    const cookies = new Cookies();
    let userid = cookies.get("userid");
    axios.post(`http://34.94.123.246:5000/product/purchase`, this.getParams({
      productId: this.props.location.state.product.pid,
      userid: userid,
      email: e.currentTarget.elements.email.value,
    }), {
      'content-type': 'application/x-www-form-urlencoded',
    })
      .then(res => {
        if (res.data.success) {
          alert("Purchase Successful");
          this.props.history.push("/");
        } else {
          alert("Purchase Failed: " + res.data.log);
        }
      })
      .catch(err => {
        console.log("In Transaction onPurchase");
        console.log(err);
        alert("SERVER ERROR");
      });
  }

  componentDidMount() {
    console.log("Transaction componentDidMount")
    console.log(this.props.location)
    this.viewProduct();
  }

  render() {
    return (
      <>
        <div className="push-down">
          <Header />
        </div>
        <Container fluid style={{ padding: "1rem 2rem" }}>
          <h1>Buying Product</h1>
          <hr />
          <Row>
            <Col md={1} />
            <Col>
              {this.state.list}
              <hr />
              <h2 style={{ fontWeight: 'bold', textDecorationLine: 'underline', }}>Confirmation</h2>
              <Form onSubmit={this.onPurchase}>
                <FormGroup as={Row}>
                  <FormLabel column md="3" for="price">Product Price:</FormLabel>
                  <Col md="auto">
                    <FormControl type="text" id="price" value={this.state.price} readOnly />
                  </Col>
                </FormGroup>
                <hr />
                <p style={{ fontWeight: 'bold' }}>Enter Email to Confirm Your Purchase:</p>
                <FormGroup as={Row}>
                  <FormLabel column md="3" for="email">Email:</FormLabel>
                  <Col md="auto">
                    <FormControl className="validate" type="email" id="email" name="email" placeholder="Enter Email..." />
                  </Col>
                  <Col />
                  <Button type="submit">Confirm Purchase</Button>
                </FormGroup>
              </Form>
            </Col>
            <Col md={1} />
          </Row>
        </Container>
      </>
    );
  }
}
export default withRouter(Transaction);
