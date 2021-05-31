import React from 'react';
import { Button, Container, Form, FormControl, FormLabel, Modal, Col, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import auth from '../../../auth';

function AdminSigninModal(props){
  const [loginMess, setLoginMess] = React.useState("");

  const onLogin = (e) => {
    e.preventDefault();
    auth.adminLogin(e.currentTarget.elements.loginUser.value, e.currentTarget.elements.loginPassword.value,
      props.cb, (mess) => { setLoginMess(mess) });
  }

  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="AdminSigninModal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Admin Only
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={onLogin}>
            <div className="md-form mb-3">
              <FormLabel for="loginUser">Admin ID:</FormLabel>
              <FormControl className="validate" type="text" id="loginUser" name="loginUser" placeholder="Enter admin id..." />
            </div>
            <div className="md-form mb-3">
              <FormLabel for="loginPassword">Password</FormLabel>
              <FormControl type="password" id="loginPassword" name="loginPassword" placeholder="Enter password..." />
            </div>
            <Row>
              <Col md={2}>
                <Button type="submit" className="btn btn-primary ">Login</Button>
              </Col>
              <Col md={1} />
              <Col md="auto">
                <div style={{ color: "red" }} >{loginMess}</div>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default withRouter(AdminSigninModal);
