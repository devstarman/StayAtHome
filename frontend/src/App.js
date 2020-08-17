import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './context/appContext';
import styled from 'styled-components';

import { Home } from './screens/Home';
import { Rules } from './screens/Rules';
import { NoMatch } from './screens/NoMatch';
import { LoadUser } from './components/LoadUser';
import { NavigationBar } from './components/NavigationBar';
import { Jumbotron } from './components/Jumbotron';

const StyledMainView = styled.div`
  background-color: #fff;
  background-size: cover;
  width: 100%;
  height: 100%;
`;
const StyledNavigationContainer = styled.div`
  height: 60px;
  @media (max-width: 768px) {
  height: 40px;
}
`;
const StyledJumbotronContainer = styled.div`
  height: ${props => props.isLoggedIn ? '150px' : '200px'};
  @media (max-width: 768px) {
    height: ${props => props.isLoggedIn ? '95px' : '135px'};
  }
`;
const StyledPageContainer = styled.div`
  height: ${props => props.isLoggedIn ? 'calc(100% - 210px)' : 'calc(100% - 260px)'};
`;

const App = () => {

  // React Context API State
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            token: action.token,
            name: action.name,
            imageUrl: action.picture,
            allowedVotingUp: action.allowedVotingUp,
            allowedVotingDown: action.allowedVotingDown,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            token: '',
            name: '',
            imageUrl: '',
            allowedVotingUp: false,
            allowedVotingDown: false,
          };
        case 'CHANGE_ROUTE':
          return {
            ...prevState,
            currentRoute: action.route,
          };
        case 'PAGE_LOADED':
          return {
            ...prevState,
            pageLoaded: action.value,
          };
        case 'VIEW_TYPE':
          return {
            ...prevState,
            viewType: action.viewType,
          };
        case 'SET_VOTIN_UP_FALSE':
          return {
            ...prevState,
            allowedVotingUp: false,
          };
        case 'SET_VOTING_DOWN_FALSE':
          return {
            ...prevState,
            allowedVotingDown: false,
          };        
        default: 
          return prevState;
      }
    },
    {
      isLoggedIn: false,
      pageLoaded: false,
      currentRoute: 'home',
      viewType: 'best',
      token: '',
      name: '',
      imageUrl: '',
      allowedVotingUp: false,
      allowedVotingDown: false,
      screenType: 'web',
    }
  );
  const appContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({ type: 'SIGN_IN', token: data.token, name: data.name, picture: data.picture, allowedVotingUp: data.allowedVotingUp, allowedVotingDown: data.allowedVotingDown });
      },
      signOut: () => {
        dispatch({ type: 'SIGN_OUT' });
      },  
      changeRoute: async data => {
        dispatch({ type: 'CHANGE_ROUTE', route: data});
      },
      setPageLoaded: async data => {
        dispatch({ type: 'PAGE_LOADED', value: data});
      },
      setViewType: async data => {
        dispatch({ type: 'VIEW_TYPE', viewType: data});
      },
      setVotingUpFalse: () => {
        dispatch({ type: 'SET_VOTIN_UP_FALSE'});
      },
      setVotingDownFalse: () => {
        dispatch({ type: 'SET_VOTING_DOWN_FALSE'});
      },
      currentState: state,
    }),
    [state]
  );

    const screenType = (window.innerWidth <= 720) ? 'mobile' : 'web';

    return (
      <AppContext.Provider value={appContext}>
        { state.pageLoaded === true ? 
          <React.Fragment>
            <Router>
              <StyledMainView>
                <StyledNavigationContainer isLoggedIn={state.isLoggedIn}>
                  <NavigationBar height={screenType === 'mobile' ? '40px' : '60px'} screenType={screenType} />
                </StyledNavigationContainer>
                <StyledJumbotronContainer isLoggedIn={state.isLoggedIn}>
                  <Jumbotron screenType={screenType} />
                </StyledJumbotronContainer>
                <StyledPageContainer isLoggedIn={state.isLoggedIn}>
                  <Switch>
                    <Route exact path="/" component={Home} height='100%' />
                    <Route path="/rules" component={Rules} />
                    <Route component={NoMatch} />
                  </Switch>
                </StyledPageContainer>
              </StyledMainView>
            </Router>
          </React.Fragment>
        :
          <React.Fragment>
            <LoadUser />
          </React.Fragment>
        }
      </AppContext.Provider>
    );

}

export default App;