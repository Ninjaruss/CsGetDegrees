import React from 'react';
import { Route, useHistory } from 'react-router-dom'
import auth from './auth'
import AdminSignUpModal from "./components/Admin/Modals/AdminSigninModal";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  let history = useHistory();
  return (
    <Route {...rest} render={(props) => {
      if (auth.isAdminAuthenticated()) {
        return <Component {...props} />;
      } else {
        return <AdminSignUpModal
          show={true}
          onHide={() => { history.push("/") }}
          cb={() => { setRedirectToReferrer(!redirectToReferrer) }}
        />;
      }
    }} />
  );
}

export default PrivateRoute;