import axios from 'axios';
import Cookies from 'universal-cookie';

class Auth {

  getParams = (obj) => {
    const params = new URLSearchParams();
    const keys = Object.keys(obj);
    for (let k of keys) {
      params.append(k, obj[k]);
    }
    return params;
  }

  config = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    }
  };

  login(name, pass, cb, setLoginMess) {
    setLoginMess("Loading...");
    axios.get(`http://34.94.123.246:5000/login`, {
      auth: {
        username: name,
        password: pass
      }
    })
      .then(res => {
        // need to change boolean to token soon
        // expiration day
        if (res.data.data[0].auth_successful) {
          const cookies = new Cookies();
          cookies.set('userid', res.data.data[0].uid);
          setLoginMess(" ");
          cb();
        } else {
          setLoginMess("Username or password is wrong");
        }
      })
      .catch((err) => {
        setLoginMess("SERVER ERROR");
        console.log(err);
      });
  }

  logout(cb) {
    const cookies = new Cookies();
    cookies.remove('userid');
    cb();
  }

  createAcc(mail, name, pass, setSignUpMess) {
    setSignUpMess("Loading...");

    axios.post(`http://34.94.123.246:5000/createAcc`, this.getParams({ email: mail, }), {
      'content-type': 'application/x-www-form-urlencoded',
      auth: {
        username: name,
        password: pass,
      }
    })
      .then(res => {
        if (res.data.data[0].user_created) {
          setSignUpMess("Account Created");
        } else {
          setSignUpMess("Fail to create account");
          console.log("Create account failed");
        }
      })
      .catch(err => {
        setSignUpMess("SERVER ERROR");
        console.log(err);
      })
  }

  isAuthenticated() {
    const cookies = new Cookies();
    if (cookies.get("userid")) {
      return true;
    }
    return false;
  };

  adminLogin(name, pass, cb, setLoginMess) {
    setLoginMess("Loading...");
    axios.post(`http://34.94.123.246:5000/adminLogin`, this.getParams({ username: name, password: pass }), this.config)
      .then(res => {
        if (res.data.data[0].auth_successful) {
          const cookies = new Cookies();
          cookies.set('adminid', res.data.data[0].uid);
          setLoginMess(" ");
          cb();
        } else {
          setLoginMess("Admin ID or password is wrong");
        }
      })
      .catch((err) => {
        setLoginMess("SERVER ERROR");
        console.log(err);
      });
  }

  isAdminAuthenticated() {
    const cookies = new Cookies();
    if (cookies.get("adminid")) {
      return true;
    }
    return false;
  };

  adminLogout(cb) {
    const cookies = new Cookies();
    cookies.remove('adminid');
    cb();
  }
}

export default new Auth();
