import React, {useState, useEffect} from 'react';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';

import { AppContext } from '../context/appContext';
import { API_URL } from '../constants';

const StyledMainView = styled.div`
  width: 95%;
  height: ${props => props.height};
  display: flex;
  justify-content: flex-end;
`;

const StyledImage = styled.img`
  border-radius: 50%;
  height: ${props => props.imageSize};
  width: ${props => props.imageSize};
  max-height: 50px;
  max-width: 50px; 
  min-height: 20px;
  min-width: 20px;
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  color: black;
  @media (max-width: 768px) {
    margin: 0px;
    padding: 0px;
    height: 50px;
    width: 80px;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  color: black;
  @media (max-width: 768px) {
    height: 22px;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const NavigationBar = (props) => {

  const { signOut, currentState } = React.useContext(AppContext);
  const [dropdownButtonVisibility, setDropdownButtonVisiblity] = useState(false);

  useEffect(() => {
    if(currentState.isLoggedIn) {
      setDropdownButtonVisiblity(true);
    } else {
      setDropdownButtonVisiblity(false);
    }
  }, [currentState]);

  const onSelectHandler = async (event) => {
    if(event === 'logout') {
      signOut();
      //clear token
      localStorage.removeItem('flag');
    } else if (event === 'delete') {
      let confirmation = window.confirm("Are you sure? By clicking OK you delete your account and all your posts as well as remove yourself from main page counter.");
      if(confirmation) {
        // backend server call to delete user
        deleteUser();
      }
    }
  }

  const deleteUser = async () => {
    const request = new Request(API_URL+'/api/users/deleteMe', {
      method: 'DELETE',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': currentState.token,  
      }
    });
    try {
      const response = await fetch(request);
      if(response.status === 200) {
        signOut();
        //clear token
        localStorage.removeItem('flag');
      } else {
        return;
      }
    } catch(error) {
      return;
    }
  }

  let imageSize = '9vh';
  if(props.screenType === 'mobile') {
    imageSize = '30px';
  }

  return (
      <StyledMainView height={props.height}>
            { dropdownButtonVisibility && 
              <Dropdown alignRight onSelect={onSelectHandler} focusFirstItemOnShow={true}>
              <Dropdown.Toggle variant='outline'>
                <StyledImage src={currentState.imageUrl} imageSize={imageSize} alt="Avatar" />
              </Dropdown.Toggle>
              <StyledDropdownMenu>
                <StyledDropdownItem eventKey='logout'>Logout</StyledDropdownItem>
                <StyledDropdownItem eventKey='delete'>Delete account</StyledDropdownItem>
              </StyledDropdownMenu>
              </Dropdown>
            }  
      </StyledMainView>
  );
}