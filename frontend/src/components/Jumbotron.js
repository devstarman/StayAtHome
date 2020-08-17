import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FaFacebook } from 'react-icons/fa';

import { API_URL } from '../constants';
import { AppContext } from '../context/appContext';
import Counter from '../components/Counter';

const facebookAppIdConfig = '634663717473110'; // localhost
// const facebookAppIdConfig = '687114945358988'; // prod?

const StyledMainView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-conent: center;
`;

const StyledDescriptionText = styled.p`
  font-size: 24px;
  color: #222;
  margin-top: 0px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 5px;
  }
`;

const StyledLink = styled(Link)`
  margin-top: 10px;
  text-decoration: underline;
  color: #222;
  @media (max-width: 768px) {
    margin-top: 5px;
    font-size: 12px;
  }
`;

export const Jumbotron = (props) => {
  const [subText, setSubText] = useState('people are staying at home');
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const { signIn, currentState } = React.useContext(AppContext);

  useEffect(() => {
    // fires up when currentState is updated
    if(currentState.isLoggedIn) {
      setSubText('people are staying at home with you');
      setButtonVisibility(false);
    } else {
      setSubText('people are staying at home');
      setButtonVisibility(true);
    }
  },[currentState]);

  const responseFacebook = (response) => {
    let name = response.name.substr(0,response.name.indexOf(' '));
    let id = response.userID;
    let picture = response.picture.data.url;
    authUser(name, id, picture);
  }

  const authUser = async (name, id, picture) => {
    // register or login user
    const request = new Request(API_URL+'/api/users/create', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',  
      },
      body: JSON.stringify({
          firstName: name,
          fbId: id,
          imageUrl: picture
      })
    });
    try {
      const response = await fetch(request);
      if(response.status === 200) {
        let userToken = response.headers.get('X-Auth-Token');
        let responseBody = await response.json();
        if(userToken) {
          //save token
          localStorage.setItem('flag', userToken);
          //context signIn
          signIn({
            token: userToken,
            name: name,
            picture: picture,
            allowedVotingUp: responseBody.allowedVotingUp,
            allowedVotingDown: responseBody.allowedVotingDown
          });
        }   
      } else {
          return;
      }
    } catch(error) {
      return;
    }
  }

  const screenType = (window.innerWidth <= 768) ? 'mobile' : 'web';
  const FbButtonSize = (screenType === 'mobile' ? 'sm' : 'lg');
  const FbLogoSize = (screenType === 'mobile' ? '20' : '30');

  return (
    <StyledMainView>
      <Counter />
      <StyledDescriptionText>{subText}</StyledDescriptionText>
      { buttonVisibility && 
        <FacebookLogin
          appId={facebookAppIdConfig}
          fields="name,picture"
          /*autoLoad*/
          callback={responseFacebook}
          render={renderProps => (
            <Button variant="outline-primary" onClick={renderProps.onClick} size={FbButtonSize}><FaFacebook size={FbLogoSize} />{' '}Join</Button>
          )}
        />
      }
      {currentState.currentRoute === 'home' &&
        <StyledLink to="/rules">RULES</StyledLink>        
      }
      {currentState.currentRoute !== 'home' &&
        <StyledLink to="/">BOARD</StyledLink>
      }
    </StyledMainView>
  );
}
