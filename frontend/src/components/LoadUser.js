import React, { useEffect } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import styled from 'styled-components';

import { AppContext } from '../context/appContext';
import { API_URL } from '../constants';

const StyledMainView = styled.div`
  display: flex;
  flex: 1;
  position: absolute;
  top: 0px;
  left: 0px;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  width: 100%;
  height: 100%;
`;

export const LoadUser = () => {

    const { signIn, setPageLoaded, currentState } = React.useContext(AppContext);

    useEffect(() => {
        // on load check user, if not loggedIn - check token in local storage and log in user
        if(!currentState.isLoggedIn) {
            let userToken = localStorage.getItem('flag');
            if(userToken && userToken.length > 0) {
                // verify user + get name and picture from backend server based on token
                verifyUserAndSignIn(userToken);
            } else {
                setPageLoaded(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const verifyUserAndSignIn = async (userToken) => {
        const request = new Request(API_URL+'/api/users/verify', {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': userToken,  
          }
        });
        try {
          const response = await fetch(request);
          if(response.status === 200) {
            let body = await response.json();
            signIn({
              token: userToken,
              name: body.firstName,
              picture: body.imageUrl,
              allowedVotingUp: body.allowedVotingUp,
              allowedVotingDown: body.allowedVotingDown
            });
            setPageLoaded(true); 
          } else {
            setPageLoaded(true);
            return;
          }
        } catch(error) {
          setPageLoaded(true);
          return;
        }
    }

    return (
        <StyledMainView>
            <BeatLoader
                css={''}
                size={30}
                color={"#222"}
                loading={true}
            />
        </StyledMainView>
    );

}