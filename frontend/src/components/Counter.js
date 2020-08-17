import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import styled from 'styled-components';

import { API_URL } from '../constants';

const StyledMainView = styled.div`
  font-size: 48px;
  letter-spacing: 4px;
  margin: 0;
  color: #222;
  padding: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Counter = () => {
    const [currentPeople, setCurrentPeople] = useState(0);

    const loadInitialData = async () => {
        const request = new Request(API_URL+'/api/post/initial', {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',  
          }
        });
        try {
          const response = await fetch(request);
          if(response.status === 200) {
            let body = await response.json();
            setCurrentPeople(body.people);     
          }
        } catch(error) {
          return;
        }
    }

    useEffect(() => {
        loadInitialData();
        const socket = socketIOClient(API_URL);
        socket.on("counter", data => setCurrentPeople(data));
    },[]);

    return (
        <StyledMainView>
            {currentPeople}
        </StyledMainView>
    );
}

export default Counter;