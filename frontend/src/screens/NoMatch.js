import React, { useEffect } from 'react';
import styled from 'styled-components';

import { AppContext } from '../context/appContext';

const StyledMainView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h2`
  color: black;
  margin-top: 50px;
`;

export const NoMatch = () => {

  const { changeRoute } = React.useContext(AppContext);

  useEffect(() => {
    // on load change current route
    changeRoute('nomatch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <StyledMainView>
      <StyledTitle>Page not found</StyledTitle>
    </StyledMainView>
  );

}