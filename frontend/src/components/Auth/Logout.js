// https://dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del

import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId = '820186523469-4hhhse7jujgedn0rnood11turbppur5u.apps.googleusercontent.com';

function Logout() {
    const onSuccess = () => {
        alert('Logged out successfully');
    };

    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            ></GoogleLogout>
        </div>
    );
}

export default Logout;