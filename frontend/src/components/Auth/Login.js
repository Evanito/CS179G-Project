// https://dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del

import React from 'react';

import { GoogleLogin } from 'react-google-login';

const clientId =
  '820186523469-4hhhse7jujgedn0rnood11turbppur5u.apps.googleusercontent.com';

function Login() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;