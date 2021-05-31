import React, { useEffect } from 'react';
import { Button, FormCheck, Modal, Row, Table, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import classes from '../Admin.css';

function AdminProductModal(props) {
  const [list, setList] = React.useState([]);
  const [checked, setChecked] = React.useState([]);


  // get list of approved items searched
  const getSearchedProduct = () => {
    // handle no searchParam
    if (!props.searchParam) {
      return;
    }
    axios.get(`http://34.94.123.246:5000/admin?getSearchedProduct=${props.searchParam}`)
      .then(res => {
        viewList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // view list of item searched in table
  const viewList = (products) => {
    if (!products.data) return;
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
          <td><FormCheck style={{ margin: '0 0' }} value={prod.pid} onChange={getChecked} /></td>
        </tr>
      );
    });
    setList(temp);
  };

  // handle all checked products for approval
  const getChecked = (e) => {
    const check = checked;
    let index;

    if (e.target.checked) {
      check.push(+e.target.value);
    } else {
      index = check.indexOf(+e.target.value);
      check.splice(index, 1);
    }
    setChecked(check);
  }

  // handle axios request by removeProduct buttons
  const sendEditRequest = (e) => {
    e.preventDefault();
    // quick fix for setState not asynchronous, let user to click button again

    axios.post(`http://34.94.123.246:5000/admin?removeProduct`, props.getParams({ params: checked }), props.config)
      .then(res => {
        if (res.data.success) {
          alert("Remove Product Success");
          getSearchedProduct();
        } else {
          alert("Remove Product FAILED");
        }
      })
      .catch(err => {
        alert(err);
      })
  };

  // temp table for designing
  const gettemptable = () => {
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
          <td><FormCheck style={{ margin: '0 0' }} value={1} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={2} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={3} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={4} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={5} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={6} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={7} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={8} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={9} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={10} onChange={getChecked} /></td>
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
          <td><FormCheck style={{ margin: '0 0' }} value={11} onChange={getChecked} /></td>
        </tr>
      </>
    ];
    setList(temp);
  };

  useEffect(() => { getSearchedProduct() }, [props.triggered])

  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-dialog-classname">
      <Modal.Header closeButton style={{ backgroundColor: 'darkBlue', }}>
        <Modal.Title id="contained-modal-title-vcenter" style={{ color: 'white', }}>Product Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Table striped bordered hover size="sm" className="tableFixHead table-wrapper-scroll-y " style={{ maxHeight: "450px" }}>
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
              {list}
            </tbody>
          </Table>
          <Row className="justify-content-end">
            <Button type="submit" variant="danger" onClick={sendEditRequest}>Remove checked roducts</Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default withRouter(AdminProductModal);
