import React from 'react';
import { Route, useHistory } from 'react-router-dom'
import auth from './auth'
import SignInUpModal from "./components/Layout/SignInUpModal/SignInUpModal";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  let history = useHistory();
  return (
    <Route {...rest} render={(props) => {
      if (auth.isAuthenticated()) {
        return <Component {...props} />;
      } else {
        return <SignInUpModal
          show={true}
          onHide={() => { history.push("/") }}
          cb={() => { setRedirectToReferrer(!redirectToReferrer) }}
        />;
      }
    }} />
  );
}

export default ProtectedRoute;