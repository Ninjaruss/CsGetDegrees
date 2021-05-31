import React, { Component } from 'react';
import { Button, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from "axios";
import classes from './Admin.css';
import AdminProductModal from './Modals/AdminProductModal';
import AdminUserModal from './Modals/AdminUserModal';
import auth from "../../auth";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      method: "",
      checked: [],
      productModalShow: false,
      userModalShow: false,
      productModalTriggered: 0,
      userModalTriggered: 0,
      searchParam: "",
      // header for x-www-form-urlencoded
      config: {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        }
      }
    };
  };

  // convert params to www-form-urlencoded format
  getParams = (obj) => {
    const params = new URLSearchParams();
    const keys = Object.keys(obj);
    for (let k of keys) {
      params.append(k, obj[k]);
    }
    return params;
  }

  // get list of item waiting to approve
  getProductToApprov = () => {
    axios.get(`http://34.94.123.246:5000/admin/getToApprovProduct`)
      .then(res => {
        this.viewApprovList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // view list of item waiting to approve in table
  viewApprovList = (products) => {
    const temp = products.data.map((prod) => {
      return (
        <tr key={prod.pid}>
          <td>{prod.pid}</td>
          <td>{prod.name}</td>
          <td>{prod.category}</td>
          <td>{prod.deparment}</td>
          <td>{prod.course}</td>
          <td>{prod.description}</td>
          <td>{prod.price}</td>
          <td>{prod.product_creator}</td>
          <td><FormCheck style={{ margin: '0 0' }} value={prod.pid} onChange={this.getChecked} /></td>
        </tr>
      );
    });
    this.setState({ list: temp });
  };

  // get pid of checked item and append to checked[]
  getChecked = (e) => {
    const check = this.state.checked;
    let index;

    if (e.target.checked) {
      check.push(+e.target.value);
    } else {
      index = check.indexOf(+e.target.value);
      check.splice(index, 1);
    }
    this.setState({ checked: check });
  }

  // handle all checked products for approval
  handleChecked = (e) => {
    this.setState({ method: "approveProduct" });
    this.sendEditRequest(e);
  }

  // handle all axios request by buttons
  sendEditRequest = (e) => {
    e.preventDefault();
    // quick fix for setState not asynchronous, let user to click button again
    if (this.state.method === "") return;
    // selecting the param by checking the methods
    let param;
    // selecting param
    switch (this.state.method) {
      case "approveProduct":
        param = { param: this.state.checked };
        break;
        // case "addCat":
        // case "rmCat":
        //   param = { param: e.currentTarget.elements.param.value };
        break;
      case "addDep":
      case "rmDep":
        param = { param: e.currentTarget.elements.param.value, abbr: e.currentTarget.elements.abbr.value };
        break;
      case "addCou":
      case "rmCou":
        param = {
          param: e.currentTarget.elements.param.value,
          num: e.currentTarget.elements.num.value,
          deptAbbr: e.currentTarget.elements.deptAbbr.value,
          desc: e.currentTarget.elements.desc.value
        };
        break;
      default:
        param = { param: "ERROR" };
    }
    axios.post(`http://34.94.123.246:5000/admin?${this.state.method}`, this.getParams(param), this.state.config)
      .then(res => {
        if (res.data.success) {
          alert(this.state.method + "Success");
          if (this.state.method === "approveProduct") {
            this.getProductToApprov();
          }
        } else {
          //change to res.data.error for reason
          alert(this.state.method + "FAILED");
        }
      })
      .catch(err => {
        alert(err);
      })
  };

  handleSearch = (e, modalShow) => {
    e.preventDefault();
    let param = e.currentTarget.elements.param.value === "" ? "all" : e.currentTarget.elements.param.value.split(" ").join("+");
    this.setState({ searchParam: param });
    modalShow();
  }

  // temp table for designing
  gettemptable = () => {
    const temp = [
      <>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={1} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={2} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={3} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={4} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={5} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={6} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={7} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={8} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={9} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={10} onChange={this.getChecked} /></td>
        </tr>
        <tr >
          <td>pid</td>
          <td>prod.name</td>
          <td>prod.category}</td>
          <td>prod.deparment}</td>
          <td>prod.course}</td>
          <td style={{ maxHeight: "2rem" }}>prod.description} thedzvdf asdfase fjk nawo fhoaihf;sdon c vzxvcvzdsfz gsefzsfe adfsdffsd descriptionsmad;fms; agoksdmgiagdfgdfgadfgdfgadfsczxvdszfgsdfSZ</td>
          <td>9999.99</td>
          <td>sid</td>
          <td><FormCheck style={{ margin: '0 0' }} value={11} onChange={this.getChecked} /></td>
        </tr>
      </>
    ];
    this.setState({ list: temp });
  };

  onLogout = (e) => {
    e.preventDefault();
    auth.adminLogout(() => { });
    this.props.history.push({ pathname: "/", });
  };

  // change gettemptable() to getProductToApprov() when axios is connected
  componentDidMount() {
    this.getProductToApprov();
  };

  // temporary removed functions for category
  // <h4>Category</h4>
  // <Form onSubmit={this.sendEditRequest}>
  //   <FormGroup as={Row}>
  //     <FormLabel column md="2" for="param">Name:</FormLabel>
  //     <Col md={4}>
  //       <FormControl type="text" id="param" name="param" placeholder="Enter category name..." />
  //     </Col>
  //     <Col md={4} />
  //     <Col md={1}>
  //       <Button type="submit" variant="success" onClick={() => { this.setState({ method: "addCat" }) }}>Add</Button>
  //     </Col>
  //     <Col md={1}>
  //       <Button type="submit" variant="danger" onClick={() => { this.setState({ method: "rmCat" }) }}>Remove</Button>
  //     </Col>
  //   </FormGroup>
  // </Form>
  // <hr />

  render() {
    return (
      <>
        <div className="admin-head">
          <h1 onClick={this.onLogout}>Admin</h1>
        </div>
        <div className="classes admin-body">
          <Container fluid>
            <Form onSubmit={(e) => {
              this.handleSearch(e, () => {
                this.setState({
                  productModalTriggered: this.state.productModalTriggered + 1,
                  productModalShow: true,
                });
              })
            }}>
              <FormGroup as={Row}>
                <FormLabel column md="2" for="param">Search Approved Product:</FormLabel>
                <Col md={8}>
                  <FormControl className="validate" type="text" id="param" name="param"
                    placeholder="Enter id=123 OR name=iPad OR cat/dep/cou=something" />
                </Col>
                <Col>
                  <Button type="submit">Search</Button>
                </Col>
              </FormGroup>
            </Form>
            <Form onSubmit={(e) => {
              this.handleSearch(e, () => {
                this.setState({
                  userModalTriggered: this.state.userModalTriggered + 1,
                  userModalShow: true,
                })
              })
            }}>
              <FormGroup as={Row}>
                <FormLabel column md="2" for="param">Search User:</FormLabel>
                <Col md={8}>
                  <FormControl className="validate" type="text" id="param" name="param"
                    placeholder="Enter id=123 OR name/email=John OR rating=3" />
                </Col>
                <Col>
                  <Button type="submit">Search</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <h4>Department</h4>
            <Form onSubmit={this.sendEditRequest}>
              <FormGroup as={Row}>
                <FormLabel column md="2" for="param">Name:</FormLabel>
                <Col md={4}>
                  <FormControl className="validate" type="text" id="param" name="param" placeholder="Enter department name..." />
                </Col>
                <FormLabel column md="1" for="abbr">Abbr:</FormLabel>
                <Col md={2} >
                  <FormControl className="validate" type="text" id="abbr" name="abbr" placeholder="Enter abbreviation..." />
                </Col>
                <Col md={1} />
                <Col md={1}>
                  <Button type="submit" variant="success" onClick={() => { this.setState({ method: "addDep" }) }}>Add</Button>
                </Col>
                <Col md={1}>
                  <Button type="submit" variant="danger" onClick={() => { this.setState({ method: "rmDep" }) }}>Remove</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <h4>Course</h4>
            <Form onSubmit={this.sendEditRequest} >
              <FormGroup as={Row}>
                <FormLabel column md="2" for="param">Name:</FormLabel>
                <Col md={4}>
                  <FormControl className="validate" type="text" id="param" name="param" placeholder="Enter course name..." />
                </Col>
                <FormLabel column md="1" for="num">Num:</FormLabel>
                <Col md={2} >
                  <FormControl className="validate" type="text" id="num" name="num" placeholder="Enter course num..." />
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column md="2" for="deptAbbr">Department:</FormLabel>
                <Col md={4} >
                  <FormControl className="validate" type="text" id="deptAbbr" name="deptAbbr" placeholder="Enter abbreviation..." />
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column md="2" for="desc">Description:</FormLabel>
                <Col md={6}>
                  <FormControl as="textarea" rows="2" type="text" id="desc" name="desc"
                    placeholder="Enter Description..." />
                </Col>
                <Col md={2} />
                <Col md={1}>
                  <Button type="submit" variant="success" onClick={() => { this.setState({ method: "addCou" }) }}>Add</Button>
                </Col>
                <Col md={1}>
                  <Button type="submit" variant="danger" onClick={() => { this.setState({ method: "rmCou" }) }}>Remove</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <Row>
              <Col>
                <p className="lead font-weight-bold">Products waiting to be approved:</p>
              </Col>
              <Col md={4} className="text-right">
                <Button type="submit" variant="success" onClick={this.handleChecked}>Approve checked products</Button>
              </Col>
            </Row>
            <Table striped bordered hover size="sm" className="tableFixHead table-wrapper-scroll-y border-admin" style={{ minHeight: "600px" }}>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>PID</th>
                  <th style={{ width: "15%" }}>NAME</th>
                  <th style={{ width: "10%" }}>CATEGORY</th>
                  <th style={{ width: "10%" }}>DEPARTMENT</th>
                  <th style={{ width: "5%" }}>COURSE</th>
                  <th style={{ width: "43%" }}>DESCRIPTION</th>
                  <th style={{ width: "5%" }}>PRICE</th>
                  <th style={{ width: "5%" }}>SID</th>
                  <th style={{ width: "2%" }}>APP</th>
                </tr>
              </thead>
              <tbody >
                {this.state.list}
              </tbody>
            </Table>
          </Container>
        </div>
        <AdminProductModal
          show={this.state.productModalShow}
          onHide={() => this.setState({ productModalShow: false })}
          triggered={this.state.productModalTriggered}
          getParams={this.getParams}
          config={this.state.config}
          searchParam={this.state.searchParam}
        />
        <AdminUserModal
          show={this.state.userModalShow}
          onHide={() => this.setState({ userModalShow: false })}
          triggered={this.state.userModalTriggered}
          getParams={this.getParams}
          config={this.state.config}
          searchParam={this.state.searchParam}
        />
      </>
    );
  }
}

export default withRouter(Admin);
