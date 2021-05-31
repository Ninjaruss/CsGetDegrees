import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Cookies from 'universal-cookie';
import { withRouter } from "react-router-dom";
import auth from "../../../auth";
import SignInUpModal from "../SignInUpModal/SignInUpModal";
import axios from "axios";

// Side panel function handles the side panel for users
function SidePanel(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [list, setList] = React.useState({});
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);


  const onLogout = (e) => {
    e.preventDefault();
    auth.logout(() => { setRedirectToReferrer(!redirectToReferrer) });
    props.history.push({ pathname: "/" });
  };

  const onProfile = (e) => {
    const cookies = new Cookies();
    let userid = cookies.get("userid");
    props.history.push({
      pathname: "/profile/user",
      state: { userid: userid },
    });
  }
  // displays whether user is logged in 
  const setLoggedInDisplay = (loggedIn) => {
    if (loggedIn) {
      const cookies = new Cookies();
      let userid = cookies.get("userid");
      axios.get(`http://34.94.123.246:5000/user/?getUserbyUserid=${userid}`)
        .then(res => {
          let temp = [
            <div>
              <h4>Hello, {res.data.data[0].username}</h4>
              <br />
              <Button className="btn-block" variant="danger" onClick={onLogout}>Sign Out</Button>
            </div>
          ]
          setList(temp);
        })
        .catch(err => {
          let temp = [
            <div>
              <h4>ERROR: getUser FAILED</h4>
              <br />
              <Button className="btn-block" variant="danger" onClick={onLogout}>Sign Out</Button>
            </div>
          ]
          setList(temp);
          console.log(err);
        })
    } else {
      let temp = [
        <div>
          <h4>Guest</h4>
          <br />
          <Button className="btn-block" variant="flat" onClick={() => setModalShow(true)}> Join / Login</Button>
        </div>
      ]
      setList(temp);
    }
  }
  // If keeps logged information
  useEffect(() => {
    setModalShow(false);
    const cookies = new Cookies();
    if (cookies.get("userid")) {
      setLoggedInDisplay(true);
    } else {
      setLoggedInDisplay(false);
    }
  }, [redirectToReferrer])

  return (
    <div className="SidePanel sticky-top sticky-offset" >
      <div className="all-center" style={{ minHeight: "15rem" }}>
        <br />
        <img
          src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
          alt="Profile Image"
          className="round-img "
          onClick={onProfile}
          style={{ width: "90px" }}
        />
        <div style={{ paddingTop: "1rem" }}>
          {list[0]}
        </div>
        <SignInUpModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          cb={() => { setRedirectToReferrer(!redirectToReferrer) }}
        />
      </div>
      <br />
    </div>
  );
}


export default withRouter(SidePanel);
