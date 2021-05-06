import React from 'react';

import './AltSignIn.scss';

const AltSignIn: React.FC = () => {
    return (
        <div>
            <button className={`twitter-sign-in`}>
            sign in with Twitter
            </button>

            <br />

            <button className={`google-sign-in`}>
            sign in with Google
            </button>
        </div>
      );
}

export default AltSignIn;