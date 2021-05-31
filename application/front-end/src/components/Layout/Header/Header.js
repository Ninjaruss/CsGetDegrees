import React, { Component } from "react";
import { Button, Container, Navbar, Nav, Form, FormControl, } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Cookies from 'universal-cookie';

// Header manages search bar and nav bar
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  // Push to Result when search button is clicked
  onSearch = (e) => {
    let q;
    if (e.target.elements.queries.value === "") {
      q = "all"
    } else {
      q = e.target.elements.queries.value.split(" ").join("+");
    }
    this.props.history.push({
      pathname: "/search",
      search: `queries=${q}`
    });
  };

  // Push to CreateProduct when sell product button is clicked
  onSell = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    let userid = cookies.get("userid");
    this.props.history.push({
      pathname: "/createProduct",
      state: { userid: userid },
    });
  };

  render() {
    return (
      <Navbar bg="dark" scrolling fixed="top" className="nav-sticky-offset">
        <Container fluid>
          <div className="logo">
            <Navbar.Brand href="/" className="text-light" style={{ fontSize: "2rem" }}>
              <i className="fas fa-graduation-cap"></i> Get C's
            </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-light" />
          <Form className="page-head search-form " style={{ marginLeft: "10%" }} onSubmit={this.onSearch}>
            <FormControl type="text" placeholder="Search..." className=" mr-sm-2 search-box" name="queries" />
            <Button variant="outline-info search-button" type="submit">
              <i className="fas fa-search"></i>
            </Button>
          </Form>
          <Button variant="outline-info" onClick={this.onSell}>Selling</Button>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(Header);