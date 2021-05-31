import React, { Component } from "react";
import { Button, Container, Dropdown, DropdownButton, Form, FormCheck, FormControl, FormLabel, FormGroup, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import axios from 'axios';
import FormData from 'form-data';

// Create Product page, allows users to create product
class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: "Select One",
      catList: [],
      department: "Select One",
      depList: [],
      course: "Select One",
      courList: [],
      description: "",
      unlimited: false,
      acknowledge: false,
      uploadedFile: [],
      uploadedFileURL: [],
    }
  }

  // File upload function 
  handleFileUpload = e => {
    this.setState({
      uploadedFile: [...this.state.uploadedFile, ...e.target.files],
      uploadedFileURL: [...this.state.uploadedFileURL, URL.createObjectURL(e.target.files[0])],
    })
  }

  // create product when button clicked
  onCreate = (e) => {
    e.preventDefault();
    /* console.log(e.target.elements.title.value);
     console.log(e.target.elements.quantity.value);
     console.log(this.state.unlimited);
     console.log(this.state.categories);
     console.log(this.state.department);
     console.log(e.target.elements.course.value);
     console.log(e.target.elements.tags.value);
     console.log(this.state.description);
     console.log(e.target.elements.price.value);
     console.log(this.state.acknowledge);*/

    let param = new FormData;
    param.append('name', e.target.elements.title.value);
    param.append('quantity', this.state.unlimited === true ? -1 : e.target.elements.quantity.value);
    param.append('categories', this.state.categories);
    param.append('department', this.state.department);
    param.append('course', this.state.course);
    param.append('tags', e.target.elements.tags.value);
    param.append('description', e.target.elements.desc.value);
    param.append('price', e.target.elements.price.value);
    param.append('sellerid', this.props.location.state.userid);
    for (let uploadedFile in this.state.uploadedFile) {
      param.append('images[]', uploadedFile);
    }

    /*onUploadProgress: ProgressEvent => {
      console.log("Upload Progress: " + Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%")
    }*/
    axios.post(`http://34.94.123.246:5000/product/createProduct`, param, { 'content-type': 'multipart/form-data' })
      .then(res => {
        if (res.data.success) {
          alert("Product Created");
        } else {
          alert("SERVER FAILED");
        }
      })
      .catch(err => {
        alert("SERVER ERROR");
        console.log(err);
      });

  }
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
    console.log("CreateProduct getCourse");
    console.log(dep);
    axios.get(`http://34.94.123.246:5000/list?getCourseByDepartment=${dep}`)
      .then(res => {
        const temp = res.data.data.map((cour) => {
          console.log(cour.course);
          return <Dropdown.Item key={cour.course} onClick={() => this.setState({ course: cour.course })}>{cour.course}</Dropdown.Item>
        })
        console.log(temp);
        this.setState({ courList: temp });
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.getCategories();
    this.getDepartment();
  }

  render() {
    let uploadedImage =
      this.state.uploadedFileURL.map(image => {
        return <img key={image} src={image} style={{ width: "4rem", paddingRight: "1rem" }} className="img-responsive" />
      })

    return (
      <>
        <div className="push-down">
          <Header />
        </div>

        <Container fluid style={{ padding: "20px 25px" }}>
          <h1 style={{ textAlign: 'center' }}>Creating Product</h1>
          <hr />
          <Form onSubmit={this.onCreate} style={{ justifyContent: 'center', margin: "2rem 2rem" }}>
            <FormGroup as={Row}>
              <FormLabel column md="2" for="title">Title:</FormLabel>
              <Col md={10}>
                <FormControl className="validate" type="text" id="title" name="title" placeholder="Enter Title..." />
              </Col>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="quantity">Quantity:</FormLabel>
              <Col md="auto">
                <FormControl type="number" id="quantity" name="quantity" defaultValue="1" disabled={this.state.unlimited} />
              </Col>
              <Col />
              <Col md="auto">
                <FormCheck type="checkbox" className="form-check-input" id="unlimited" onChange={() => { this.setState({ unlimited: !this.state.unlimited }) }} />
              </Col>
              <FormLabel column md="2" className="form-check-label" for="unlimited">
                Unlimited quantity
              </FormLabel>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="categories">Category:</FormLabel>
              <Col md={10}>
                <DropdownButton variant="outline-dark" id="categories" title={this.state.categories}>
                  {this.state.catList}
                </DropdownButton>
              </Col>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="department">
                Department:
              </FormLabel>
              <Col md={10}>
                <DropdownButton variant="outline-dark" id="department" title={this.state.department} >
                  {this.state.depList}
                </DropdownButton>
              </Col>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="course">
                Course:
              </FormLabel>
              <Col md={10}>
                <DropdownButton variant="outline-dark" id="course" title={this.state.course}>
                  {this.state.courList}
                </DropdownButton>
              </Col>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="tags">
                Tags:
              </FormLabel>
              <Col md={10}>
                <FormControl className="validate " type="text" id="tags" name="tags" placeholder="Enter Tags... Separate individual tags with ';'" />
              </Col>
            </FormGroup>
            <br />
            <FormGroup as={Row}>
              <FormLabel column md="2" for="desc">
                Description:
              </FormLabel>
              <Col md={10}>
                <FormControl as="textarea" rows="6" type="text" id="desc" name="desc"
                  placeholder="Enter Description...If this is a service, please include the availability of when and where..." />
              </Col>
            </FormGroup>
            <br />
            <Row>
              <Col md={2}>
                <input type="file"
                  style={{ display: 'none', }}
                  onChange={this.handleFileUpload}
                  ref={fileInput => this.fileInput = fileInput}
                />
                <Button onClick={() => this.fileInput.click()}>Upload Images</Button>
              </Col>
              <Col>
                {uploadedImage}
              </Col>
            </Row>
            <Row className="justify-content-end">
              <FormLabel column md="2" for="price">
                Price:
              </FormLabel>
              <Col md={3}>
                <FormControl type="text" id="price" name="price" placeholder="Enter Price..." />
              </Col>
            </Row>
            <br />
            <Row >
              <Col md={{ span: 5, offset: 6 }} >
                <FormCheck type="checkbox" className="form-check-input" id="acknowledge" onChange={() => { this.setState({ acknowledge: !this.state.acknowledge }) }} />
                <FormLabel className="form-check-label" for="acknowledge">Click me to agree to Terms and Conditions</FormLabel>
              </Col>
              <Col md={{ span: 0, offset: 0 }}>
                <Button type="submit" disabled={!this.state.acknowledge}>Confirm</Button>
              </Col>
            </Row>
          </Form>
        </Container>
        <Footer />
      </>
    );
  }
}

export default withRouter(CreateProduct);
