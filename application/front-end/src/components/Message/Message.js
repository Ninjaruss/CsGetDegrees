import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Container, Col, Row, Form, FormControl, Button, FormGroup, ListGroup } from 'react-bootstrap';

import classes from './Message.css';
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import SidePanel from "../Layout/SidePanel/SidePanel";

// Message class handles the message page
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      sellerContact: [],
      selectedContact: {},
      chatList: [],
      // header for x-www-form-urlencoded
      config: {
        headers: { 'content-type': 'application/x-www-form-urlencoded', }
      },
    }
    this.eventSource = new EventSource("events");
  }

  //
  getParams = (obj) => {
    const params = new URLSearchParams();
    const keys = Object.keys(obj);
    for (let k of keys) {
      params.append(k, obj[k]);
    }
    return params;
  }

  // scroll to latest message
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  // get all the contacts the user has
  getContact = () => {
    axios.get(`http://34.94.123.246:5000/message/getContact?userid=${this.props.location.state.userid}`)
      .then(res => {
        let contactExisted = false;
        if (res.data.log !== "No contacts found.") {
          this.viewContact(res.data);
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].contactid === this.props.location.state.sellerid) {
              contactExisted = true;
            }
          }
        }
        if (this.props.location.state.sellerid && !contactExisted) {
          this.getSeller(this.props.location.state.sellerid);
        }
      })
      .catch(err => {
        console.log("Message getContact failed");
        console.log(err.log)
      })
  }

  // get the chat between the user and a particular contact
  getChat = contact => {
    this.setState({ selectedContact: contact })
    axios.get(`http://34.94.123.246:5000/message/getChat?userid=${this.props.location.state.userid}&contactid=${contact.contactid}`)
      .then(res => { this.viewChat(res.data); })
      .catch(err => {
        console.log("Message getChat failed");
        console.log(err.log);
      })
  }

  // get the seller data if directed from seller profile
  getSeller = sellerid => {
    axios.get(`http://34.94.123.246:5000/user/?getUserbyUserid=${sellerid}`)
      .then(res => {
        this.viewSellerContact(res.data);
      })
      .catch(err => {
        console.log("Message getSeller failed");
        console.log(err);
      })
  }

  // handle server send event for when user receive a message
  updateChat = message => {
    console.log("In Message updateChat");
    console.log(message);
    this.viewChat(message);
  }

  // for when user send a message
  sendMessage = e => {
    e.preventDefault();
    let param = {
      message: e.target.elements.mess.value, //.split(" ").join("+")
      userid: this.props.location.state.userid,
      contactid: this.state.selectedContact.contactid,
    };

    if (param.message === "" || !param.contactid) {
      console.log("No message or no contact selected");
      return;
    }

    axios.post(`http://34.94.123.246:5000/message/sendMessage`, this.getParams(param), this.state.config)
      .then(res => {
        console.log(res.data.data);
        this.getChat(this.state.selectedContact);
      })
      .catch(err => {
        console.log("sendMessage failed");
        console.log(err.log);
      })
  }

  // for laying out the contacts
  viewContact = contact => {
    if (contact.log === "No contacts found.") {
      let temp = <Row><h5>No Contacts</h5></Row>
      this.setState({ contactList: temp });
    } else {
      let temp = contact.data.map(cont => {
        return (
          <Row>
            <Button className="btn btn-light btn-lg btn-block" onClick={() => this.getChat(cont)}>
              {cont.contactName}
            </Button>
          </Row >
        )
      });
      this.setState({ contactList: temp });
    }
  }

  // for laying out the chat
  viewChat = message => {
    let temp;
    if (message.log === "No chat found.") {
      temp = <h4 style={{ textAlign: "center" }}>You have not contacted this person yet</h4>
    } else {
      temp = message.data.map(mess => {
        if (mess.userIsReceiver) {
          return (
            <ListGroup.Item action style={{ backgroundColor: "rgb(240, 240, 240)" }}>
              <Row>{mess.date}</Row>
              <Row>{mess.message}</Row>
            </ListGroup.Item>
          )
        } else {
          return (
            <ListGroup.Item action style={{ backgroundColor: "rgb(234, 234, 225)" }}>
              <Row className="justify-content-end">{mess.date}</Row>
              <Row className="justify-content-end">{mess.message}</Row>
            </ListGroup.Item>
          )
        }
      })
    }
    this.setState({ chatList: temp });
  }

  // for displaying the seller contact
  viewSellerContact = contact => {
    let selectedContact = { contactName: contact.data[0].username, contactid: contact.data[0].uid }
    let temp = [
      <Row>
        <Button className="btn btn-light btn-lg btn-block" onClick={() => this.getChat(selectedContact)}>
          {contact.data[0].username}
        </Button>
      </Row >]
    this.setState({ sellerContact: temp, selectedContact: selectedContact });
  }

  // For testing get contact
  tempGetContact = () => {
    let param = {
      data: [
        {
          contactid: 123,
          contactName: "First contact name"
        },
        {
          contactid: 678,
          contactName: "Thrid contact name"
        },
        {
          contactid: 456,
          contactName: "Second contact name"
        },
        {
          contactid: 910,
          contactName: "Fourth contact name"
        },
      ],
      log: "The reason why it failed, only attach when needed",
    };
    this.viewContact(param.data)
  }
  // for testing get chat
  tempGetChat = contact => {
    console.log("Message tempGetChat");
    this.setState({ selectedContact: contact.contactName, contactid: contact.contactid })
    let param = {
      data: [
        {
          userIsReceiver: true,
          date: "5/23/1997 08:00",
          message: "message body",
        },
        {
          userIsReceiver: false,
          date: "5/23/1997 08:02",
          message: "Mind what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems. New plenty she horses parish design you. Stuff sight equal of my woody. Him children bringing goodness suitable she entirely put far daughter.           No in he real went find mr. Wandered or strictly raillery stanhill as. Jennings appetite disposed me an at subjects an. To no indulgence diminution so discovered mr apartments. Are off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now how nay cold real case. On projection apartments unsatiable so if he entreaties appearance. Rose you wife how set lady half wish. Hard sing an in true felt. Welcomed stronger if steepest ecstatic an suitable finished of oh. Entered at excited at forming between so produce. Chicken unknown besides attacks ga",
        },
        {
          userIsReceiver: true,
          date: "5/23/1997 08:00",
          message: "message body",
        },
        {
          userIsReceiver: false,
          date: "5/23/1997 08:02",
          message: "Mind what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems. New plenty she horses parish design you. Stuff sight equal of my woody. Him children bringing goodness suitable she entirely put far daughter.           No in he real went find mr. Wandered or strictly raillery stanhill as. Jennings appetite disposed me an at subjects an. To no indulgence diminution so discovered mr apartments. Are off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now how nay cold real case. On projection apartments unsatiable so if he entreaties appearance. Rose you wife how set lady half wish. Hard sing an in true felt. Welcomed stronger if steepest ecstatic an suitable finished of oh. Entered at excited at forming between so produce. Chicken unknown besides attacks ga",
        },
        {
          userIsReceiver: true,
          date: "5/23/1997 08:00",
          message: "message body",
        },
        {
          userIsReceiver: false,
          date: "5/23/1997 08:02",
          message: "Mind what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems. New plenty she horses parish design you. Stuff sight equal of my woody. Him children bringing goodness suitable she entirely put far daughter.           No in he real went find mr. Wandered or strictly raillery stanhill as. Jennings appetite disposed me an at subjects an. To no indulgence diminution so discovered mr apartments. Are off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now how nay cold real case. On projection apartments unsatiable so if he entreaties appearance. Rose you wife how set lady half wish. Hard sing an in true felt. Welcomed stronger if steepest ecstatic an suitable finished of oh. Entered at excited at forming between so produce. Chicken unknown besides attacks ga",
        },
        {
          userIsReceiver: true,
          date: "5/23/1997 08:00",
          message: "message body",
        },
        {
          userIsReceiver: true,
          date: "5/23/1997 08:02",
          message: "Mind what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems. New plenty she horses parish design you. Stuff sight equal of my woody. Him children bringing goodness suitable she entirely put far daughter.           No in he real went find mr. Wandered or strictly raillery stanhill as. Jennings appetite disposed me an at subjects an. To no indulgence diminution so discovered mr apartments. Are off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now how nay cold real case. On projection apartments unsatiable so if he entreaties appearance. Rose you wife how set lady half wish. Hard sing an in true felt. Welcomed stronger if steepest ecstatic an suitable finished of oh. Entered at excited at forming between so produce. Chicken unknown besides attacks ga",
        },
      ],
      log: "The reason why it failed, only attach when needed",
    }
    if (contact.contactid === 456) {
      param.data = [...param.data, {
        userIsReceiver: true,
        date: "5/12/2020 19:00",
        message: "Omae mo shindeiru",
      },
      {
        userIsReceiver: false,
        date: "5/12/2020 19:01",
        message: "Nani???",
      },
      {
        userIsReceiver: true,
        date: "5/12/2020 19:02",
        message: "LASER SOUND EFFECT",
      },]
    }
    this.viewChat(param.data);
  }


  componentDidMount() {
    this.getContact()
    this.eventSource.onmessage = e => this.updateChat(JSON.parse(e.data));
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div>
        <header className="push-down">
          <Header />
        </header>
        <Container fluid className="classes">
          <Row>
            <Col md={2} id="body-col">
              <Row id="title-row">
                <h3>Contacts:</h3>
              </Row>
              <div id="contact">
                {this.state.contactList}
                {this.state.sellerContact}
              </div>
            </Col>
            <Col md={8} id="body-col">
              <Row id="title-row" className="justify-content-between">
                <h3>Chat: {this.state.selectedContact.contactName}</h3>
                <Button variant="outline-info" onClick={() => this.getChat(this.state.selectedContact)}>Refresh Chat</Button>
              </Row>
              <ListGroup id="chat">
                {this.state.chatList}
                <div style={{ float: "left", clear: "both" }}
                  ref={(el) => { this.messagesEnd = el; }}>
                </div>
              </ListGroup>
              <Form id="messageBox" onSubmit={this.sendMessage}>
                <hr />
                <FormGroup as={Row}>
                  <Col md={10}>
                    <FormControl type="text" name="mess" placeholder="Enter Messages..." />
                  </Col>
                  <Col md={2}>
                    <Button type="submit" variant="success">Send</Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col md={2}>
              <SidePanel />
            </Col>
          </Row>
        </Container>
      </div >
    );
  }
}

export default withRouter(Message);
