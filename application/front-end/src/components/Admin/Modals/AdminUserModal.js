import React, { useEffect } from 'react';
import { Button, FormCheck, Modal, Table, Row, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import classes from '../Admin.css';

function AdminUserModal(props) {
  const [prodList, setProdList] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [userChecked, setUserChecked] = React.useState([]);
  const [productChecked, setProductChecked] = React.useState([]);
  const [selectedUserid, setSelectedUserid] = React.useState(-1);


  // get list approved user searched
  const getSearchedUser = () => {
    // handle no searchParam
    if (!props.searchParam) {
      return;
    }
    console.log("Admin getSearchedUser")
    console.log(props.searchParam);
    axios.get(`http://34.94.123.246:5000/admin?getSearchedUser=${props.searchParam}`)
      .then(res => {
        console.log(res);
        viewUserList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // view list of approved user searched
  const viewUserList = (users) => {
    console.log("AdminUserModal viewUserList");
    console.log(users);
    if (!users.data) return;
    const temp = users.data.map((user) => {
      return (
        <tr key={user.uid}>
          <td>{user.uid}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(user.uid) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={user.uid} onChange={getUserChecked} /></td>
        </tr>
      );
    });
    setUserList(temp);
  }

  // handle all checked users for removal
  const getUserChecked = (e) => {
    const check = userChecked;
    let index;

    if (e.target.checked) {
      check.push(+e.target.value);
    } else {
      index = check.indexOf(+e.target.value);
      check.splice(index, 1);
    }
    setUserChecked(check);
  }

  //get list of approved items by user (cannot get unapproved items)
  const getProductByUserid = (userid) => {
    setSelectedUserid(userid);
    axios.get(`http://34.94.123.246:5000/product/?getAllProductbyUserid=${userid}`)
      .then(res => {
        viewProductList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // view list of approved item by user in table
  const viewProductList = (products) => {
    if (products.log === "user has no product") {
      setProdList(
        <tr>
          <td>User</td>
          <td>has</td>
          <td>no</td>
          <td>product</td>
          <td>posted</td>
        </tr>);
    } else {
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
            <td><FormCheck style={{ margin: '0 0' }} value={prod.pid} onChange={getProductChecked} /></td>
          </tr>
        );
      });
      setProdList(temp);
    }
  };

  // handle all checked products for removal
  const getProductChecked = (e) => {
    const check = productChecked;
    let index;

    if (e.target.checked) {
      check.push(+e.target.value);
    } else {
      index = check.indexOf(+e.target.value);
      check.splice(index, 1);
    }
    setProductChecked(check);
  }

  // handle axios request by removeProduct buttons
  const sendEditRequest = (e, method, checked) => {
    e.preventDefault();
    // quick fix for setState not asynchronous, let user to click button again

    axios.post(`http://34.94.123.246:5000/admin?${method}`, props.getParams({ params: checked }), props.config)
      .then(res => {
        if (res.data.success) {
          alert(method + ": Success");
          switch (method) {
            case "rmUsers":
              getSearchedUser();
              break;
            case "rmProducts":
              getProductByUserid(selectedUserid);
              break;
          }
        } else {
          alert(method + ": FAILED");
        }
      })
      .catch(err => {
        alert(err);
      })
  };

  // temp table for designing
  const getprodtemptable = () => {
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
          <td><FormCheck style={{ margin: '0 0' }} value={1} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={2} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={3} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={4} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={5} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={6} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={7} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={8} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={9} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={10} onChange={getProductChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={11} onChange={getProductChecked} /></td>
        </tr>
      </>
    ];
    setProdList(temp);
  };

  const getusertemptable = () => {
    const temp = [
      <>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(1) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={1} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(2) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={2} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(3) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={3} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(4) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={4} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(5) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={5} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(6) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={6} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(7) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={7} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(8) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={8} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(9) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={9} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(10) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={10} onChange={getUserChecked} /></td>
        </tr>
        <tr >
          <td>uid</td>
          <td>user.name}</td>
          <td>user.email}</td>
          <td><Button type="submit" variant="outline-primary" onClick={() => { getProductByUserid(11) }}>Get Products</Button></td>
          <td><FormCheck style={{ margin: '0 0' }} value={11} onChange={getUserChecked} /></td>
        </tr>
      </>
    ];
    setUserList(temp);
  };

  useEffect(() => { getSearchedUser() }, [props.triggered])

  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-dialog-classname">
      <Modal.Header closeButton style={{ backgroundColor: 'darkBlue', }}>
        <Modal.Title id="contained-modal-title-vcenter" style={{ color: 'white', }}>User Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Table striped bordered hover size="sm" className="tableFixHead table-wrapper-scroll-y " style={{ maxHeight: "200px" }}>
            <thead>
              <tr>
                <th style={{ width: "5%" }}>UID</th>
                <th style={{ width: "20%" }}>NAME</th>
                <th style={{ width: "30%" }}>EMAIL</th>
                <th style={{ width: "15%" }}>GET PRODUCTS</th>
                <th style={{ width: "2%" }}>RM</th>
              </tr>
            </thead>
            <tbody >
              {userList}
            </tbody>
          </Table>
          <Row className="justify-content-end" >
            <Button type="submit" variant="success" style={{ marginRight: 13 }} onClick={(e) => { sendEditRequest(e, "rmUsers", userChecked) }}>Remove checked User</Button>
          </Row>
          <br />
          <Table striped bordered hover size="sm" className="tableFixHead table-wrapper-scroll-y " style={{ maxHeight: "250px" }}>
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
                <th style={{ width: "2%" }}>RM</th>
              </tr>
            </thead>
            <tbody >
              {prodList}
            </tbody>
          </Table>
          <Row className="justify-content-end">
            <Button type="submit" variant="success" style={{ marginRight: 13 }} onClick={(e) => { sendEditRequest(e, "rmProducts", productChecked) }}>Remove checked products</Button>
          </Row>
          <br />
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default withRouter(AdminUserModal);
