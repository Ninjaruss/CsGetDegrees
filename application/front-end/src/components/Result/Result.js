import React, { Component } from "react";
import axios from "axios";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Dropdown, DropdownButton, Form, FormControl, FormLabel, FormGroup } from "react-bootstrap";

import { withRouter } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBTooltip, MDBCardFooter, MDBIcon, MDBBtn, } from "mdbreact";
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import SidePanel from "../Layout/SidePanel/SidePanel";

// Result page for displaying result items searched
class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: "",
      resultList: [],
      categories: "All",
      catList: [],
      department: "All",
      depList: [],
      course: "All",
      courlist: [],
      minPrice: "",
      maxPrice: "",
      minRating: "",
      maxRating: "",
    };
  }

  // get the search response when component did mount
  onSearch = (props) => {

    let q;
    if (props.location.search === "?queries=") {
      q = "?queries=all";
      this.setState({ queries: q });
    } else {
      q = props.location.search;
      this.setState({ queries: props.location.search });
    }
    axios.get(`http://34.94.123.246:5000/search/${q}`)
      .then((res) => {
        this.viewResult(res.data);
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  };

  // apply filter and get response when filter button was clicked
  onFilter = (e) => {
    axios.get(`http://34.94.123.246:5000/search/${this.state.queries}`, {
      params: {
        ...(this.state.categories === "All" ? {} : { categories: this.state.categories }),
        ...(this.state.department === "All" ? {} : { department: this.state.department }),
        ...(this.state.course === "All" ? {} : { course: this.state.course }),
        ...(this.state.minPrice === "" ? {} : { minPrice: this.state.minPrice }),
        ...(this.state.maxPrice === "" ? {} : { maxPrice: this.state.maxPrice }),
        ...(this.state.minRating === "" ? {} : { minRating: this.state.minRating }),
        ...(this.state.maxRating === "" ? {} : { maxRating: this.state.maxRating }),
      },
    })
      .then((res) => {
        console.log(res.data);
        this.viewResult(res.data);
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
    // console.log("TESTING");
    // console.log(this.state.categories);
    // console.log(this.state.department);
    // console.log(this.state.course);
    // console.log(this.state.minPrice);
    // console.log(this.state.maxPrice);
    // console.log(this.state.minrating);
    // console.log(this.state.maxRating);
  };

  // filter function
  filterProd() {
    return (
      <Form
        className="input FilterPanel sticky-top sticky-offset push-down"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h1>Filter</h1>
        <FormGroup>
          <Form.Row>
            <Col>
              <Form.Label className="labelmargin" for="categories">Category:</Form.Label></Col>
            <Col>
              <DropdownButton variant="flat" id="categories" title={this.state.categories}>
                <Dropdown.Item onClick={() => this.setState({ categories: "All" })}>All</Dropdown.Item>
                <Dropdown.Divider />
                {this.state.catList}
              </DropdownButton>
            </Col>
          </Form.Row>
        </FormGroup>
        <FormGroup>
          <Form.Row>
            <Col>
              <Form.Label className="labelmargin" for="department">Department:</Form.Label>
            </Col>
            <Col>
              <DropdownButton variant="flat" id="department" title={this.state.department}>
                <Dropdown.Item onClick={() => {
                  this.setState({ department: "All" });
                  this.getCourse("all");
                }} >All</Dropdown.Item>
                <Dropdown.Divider />
                {this.state.depList}
              </DropdownButton>
            </Col>
          </Form.Row>
        </FormGroup>
        <FormGroup>
          <Form.Row>
            <Col>
              <Form.Label className="labelmargin" for="course">Course:</Form.Label>
            </Col>
            <Col>
              <DropdownButton variant="flat" id="course" title={this.state.course}>
                <Dropdown.Item onClick={() => this.setState({ course: "All" })} >All</Dropdown.Item>
                <Dropdown.Divider />
                {this.state.courlist}
              </DropdownButton>
            </Col>
          </Form.Row>
        </FormGroup>
        <FormGroup>
          <Form.Row>
            <Row><Form.Label className="labelmargin " for="minPrice">Price Range </Form.Label>
              <FormControl
                type="text"
                id="minPrice"
                className="range"
                placeholder="Min"
                value={this.state.minPrice}
                onChange={(e) => { this.setState({ minPrice: e.target.value }); }}
              />
              <FormControl
                type="text"
                id="maxPrice"
                className="range"
                placeholder="Max"
                value={this.state.maxPrice}
                onChange={(e) => { this.setState({ maxPrice: e.target.value }); }}
              />
            </Row>
          </Form.Row>
        </FormGroup>
        <FormGroup>
          <Form.Row>
            <Row><Form.Label className="labelmargin " for="minRating">Rating </Form.Label>
              <FormControl
                type="text"
                id="minRating"
                className="range"
                placeholder="Min"
                value={this.state.minRating}
                onChange={(e) => { this.setState({ minRating: e.target.value }); }}
              />
              <FormControl
                type="text"
                id="maxRating"
                className="range"
                placeholder="Max"
                value={this.state.maxRating}
                onChange={(e) => { this.setState({ maxRating: e.target.value }); }}
              />
            </Row>
          </Form.Row>
        </FormGroup>
        <Button variant="flat" onClick={this.onFilter}>Filter</Button>
      </Form>
    );
  }

  // push to Product when a product in the list was clicked
  onClick = (pid) => {
    this.props.history.push({
      pathname: "/product",
      state: {
        productId: pid,
      },
    });
  };

  // view the result of search queries
  viewResult = (products) => {
    //For when no result found
    if (!products.data) {
      this.setState({ resultList: [<h1>No Result Found...</h1>] });
      return;
    }

    const temp = products.data.map((prod) => {
      return (
        <MDBCard
          className="m-2 card-shadow"
          style={{ width: "22rem" }}
          cascade
          ecommerce
          wide
          key={prod.pid}
        >
          <MDBCardImage
            cascade
            top
            waves
            onClick={(e) => {
              e.preventDefault();
              this.onClick(prod.pid);
            }}
            src="https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2664&q=80"
          // put modal here

          />
          <MDBCardBody
            cascade
            className="text-center"
            // entire card body accept onClick event
            onClick={(e) => {
              e.preventDefault();
              this.onClick(prod.pid);
            }}
          >
            <MDBCardTitle tag="h6">{prod.category}</MDBCardTitle>
            <MDBCardTitle>
              <a>
                <Button className="btn-block" variant="flat"><strong>{prod.name}</strong></Button>
              </a>
            </MDBCardTitle>
            <MDBCardText>{prod.description}</MDBCardText>
            <MDBCardFooter>
              <span className="float-center font-weight-bold">${prod.price}</span>
            </MDBCardFooter>
          </MDBCardBody>
        </MDBCard>
      );
    });
    this.setState({ resultList: temp });
  };


  // Get list of categories
  getCategories = () => {
    axios.get(`http://34.94.123.246:5000/category/getAllCategories `)
      .then(res => {
        const temp = res.data.data.map((cat) => {
          return <Dropdown.Item key={cat.category} onClick={() => this.setState({ categories: cat.category })}> {cat.category} </Dropdown.Item>
        })
        this.setState({ catList: temp });
      })
      .catch(err => {
        console.log(err);
      })
  }

  // Get list of departments
  getDepartment = () => {
    axios.get(`http://34.94.123.246:5000/list?getDepartment`)
      .then(res => {
        const temp = res.data.data.map((dep) => {
          return (
            <Dropdown.Item key={dep.department} onClick={() => {
              this.setState({ department: dep.department });
              this.getCourse(dep.department.split(" ").join("+"));
            }}>
              {dep.department}
            </Dropdown.Item>)
        })
        this.setState({ depList: temp });
      })
      .catch(err => {
        console.log(err);
      })
  }

  // Get list of course
  getCourse = (dep) => {
    if (dep === "all") {
      this.setState({ courlist: [], course: "All" });
      return;
    }
    axios.get(`http://34.94.123.246:5000/list?getCourseByDepartment=${dep}`)
      .then(res => {
        const temp = res.data.data.map((cour) => {
          return <Dropdown.Item key={cour.course} onClick={() => this.setState({ course: cour.course })}>{cour.course}</Dropdown.Item>
        })
        this.setState({ courlist: temp });
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.onSearch(this.props);
    this.getCategories();
    this.getDepartment();
  }

  render() {
    return (
      <div className="Result page-container content-wrap page-wrapper">
        <div className="page-wrapper">
          <div className="push-down">

            <Header />
          </div>
          <br />
          <Container fluid>
            <Row>
              <Col sm={3}>
                {this.filterProd()}
              </Col>
              <Col sm={7} className="centerCol">
                <Row>
                  {this.state.resultList}
                </Row>
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
export default withRouter(Result);