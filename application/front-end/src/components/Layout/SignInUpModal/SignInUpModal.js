import React, { useEffect } from 'react';
import { Button, Container, Form, FormCheck, FormControl, FormLabel, Modal, Col, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import auth from '../../../auth';

function SignInUpModal(props) {
  const [loginMess, setLoginMess] = React.useState("");
  const [signupMess, setSignUpMess] = React.useState("");
  const [acknowledge, setAcknowledge] = React.useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    auth.login(e.currentTarget.elements.loginUser.value, e.currentTarget.elements.loginPassword.value,
      props.cb, (mess) => { setLoginMess(mess) });
  }
  const onSignup = (e) => {
    e.preventDefault();
    if (e.currentTarget.elements.signupPassword.value === e.currentTarget.elements.checkSignupPassword.value) {
      if (e.currentTarget.elements.signupEmail.value.substring(e.currentTarget.elements.signupEmail.value.length - 14, e.currentTarget.elements.signupEmail.value.length) === "@mail.sfsu.edu") {
        auth.createAcc(e.currentTarget.elements.signupEmail.value, e.currentTarget.elements.signupUser.value, e.currentTarget.elements.signupPassword.value,
          (mess) => { setSignUpMess(mess) });
      } else {
        setSignUpMess("Valid Email is Needed");
      }
    } else {
      setSignUpMess("Password Not Match");
    }
  }

  useEffect(() => {
    setLoginMess("");
    setSignUpMess("");
  }, [props.location])

  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="SignInUpModal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sign Up / Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <h1>Sign In</h1>
          <hr />
          <Form onSubmit={onLogin}>
            <div className="md-form mb-3">
              <FormLabel for="loginUser">Email/Username</FormLabel>
              <FormControl className="validate" type="text" id="loginUser" name="loginUser" placeholder="Enter email or username..." />
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
        <hr />

        <Container fluid>
          <h1>Sign Up</h1>
          <hr />
          <Form onSubmit={onSignup}>
            <div className="md-form mb-3">
              <FormLabel for="signupEmail">Email address</FormLabel>
              <FormControl type="email" className="form-control" id="signupEmail" placeholder="Enter email..." />
            </div>
            <div className="md-form mb-3">
              <FormLabel for="signupUser">Username</FormLabel>
              <FormControl type="text" className="form-control" id="signupUser" placeholder="Enter username..." />
            </div>
            <div cclassName="md-form mb-3">
              <FormLabel for="signupPassword">Password</FormLabel>
              <FormControl type="password" className="form-control" id="signupPassword" placeholder="Enter password..." />
            </div>
            <div className="md-form mb-3">
              <FormLabel for="checkSignupPassword">Re-enter Password</FormLabel>
              <FormControl type="password" className="form-control" id="checkSignupPassword" placeholder="Verify Password..." />
            </div>
            <Row>
              <Col md="auto">
                <FormCheck type="checkbox" className="form-check-input" id="acknowledge" onChange={() => { setAcknowledge(!acknowledge) }} />
              </Col>
              <FormLabel columnmd={{ span: 5, offset: 1 }} className="form-check-label" for="acknowledge">
                Click me to agree to Terms and Conditions
              </FormLabel>
            </Row>
            <br />
            <Row>
              <Col md={4}>
                <Button type="submit" className="btn btn-primary" disabled={!acknowledge}>Sign Up</Button>
              </Col>
              <Col md={1} />
              <Col md="auto">
                <div style={{ color: "red" }} >{signupMess}</div>
              </Col>
            </Row>
          </Form>
        </Container>

      </Modal.Body>
    </Modal>
  );
}

export default withRouter(SignInUpModal);
