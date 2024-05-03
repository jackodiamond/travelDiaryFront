import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector hook from react-redux

function AuthenticatedWrapper({ children }) {

  // Redux state for isAuthenticated
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  return (
    <>
      {true ? (
        <>
          {children}
        </>
      ) : (
        <div>
          <p>Please login to view feeds.</p>
          {/* You can add a link to the login page here */}
        </div>
      )}
    </>
  );
}

export default AuthenticatedWrapper;
