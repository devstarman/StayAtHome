import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AppContext } from '../context/appContext';

const StyledMainView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20;
  width: 100%;
`;

const StyledConfinedView = styled.div`
  width: 60%;
`;

const ImportantNote = styled.h5`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Rules = () => {

  const { changeRoute } = React.useContext(AppContext);

  useEffect(() => {
    // on load change current route
    changeRoute('manifest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <StyledMainView>
      <StyledConfinedView>
        <h2>Rules</h2>
        <span>This page was created to encourage people to stay at home during COVID-19 pandemic.</span>
        <ImportantNote>Votes should be used with special consideration:</ImportantNote>
        <span>
            1. Each user can add only one post per day.<br />
            2. Each user can vote up only 1 post per day.<br />
            3. Each user can vote down only 1 post per day.<br />
            <br />
            There is limit of 140 characters for every post (early twitter style).<br />
            <strong>Main board is updated automatically and may take a few seconds to refresh.</strong>
        </span>
      </StyledConfinedView>
    </StyledMainView>
  );

}