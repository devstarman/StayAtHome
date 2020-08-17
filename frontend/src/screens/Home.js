import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import socketIOClient from "socket.io-client";

import { AppContext } from '../context/appContext';
import { API_URL } from '../constants';
import { AddText } from '../components/AddText';
import { ItemsList } from '../components/ItemsList';

const StyledMainView = styled.div`
  height: 100%;
  display: flex; 
  flex-direction: column; 
  align-items: center;
`;

const StyledTopBar = styled.div`
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 2px;
  width: 100%;
`;

const StyledTopButton = styled(Button)`
  width: 140px;
  margin: 10px;
  @media (max-width: 768px) {
    width: 80px;
    margin: 5px;
    font-size: 12px;
  }
`;

const StyledBoardView = styled.div`
  display: flex;
  flex-direction: column;
  height: ${props => props.isLoggedIn ? "calc(90% - 140px)" : "calc(90% - 60px)"};
  max-height: ${props => props.isLoggedIn ? "calc(90% - 140px)" : "calc(90% - 60px)"};
  width: 90%;
  padding: 20px;
  background-color: #eee;
  overflowY: scroll;
  @media (max-width: 768px) {
    width: 98%;
    padding: 4px;
    overflow-y: visible;
    height: auto;
    min-height: calc(100% - 80px);
    max-height: auto;
  }
`;

export const Home = () => {

  const { changeRoute, setViewType, currentState } = React.useContext(AppContext);
  const [listOfItems, setListOfItems] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [buttonBestVariant, setButtonBestVariant] = useState('primary');
  const [buttonOthersVariant, setButtonOthersVariant] = useState('outline-primary');
  const [buttonMineVariant, setButtonMineVariant] = useState('outline-primary');

  useEffect(() => {
    changeRoute('home');
    loadInitialData();
    // on load get current items
    if(currentState.viewType === 'best') {
      const socket = socketIOClient(API_URL);
      socket.on("best", data => setListOfItems(data));
    } else if(currentState.viewType === 'others') {
      fetchCurrentPage();
    } else if(currentState.viewType === 'mine') {
      fetchMyPosts();
    } else {
      setListOfItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentState.viewType]);

  const fetchCurrentPage = async () => {
    const request = new Request(API_URL+'/api/post/page/'+currentPageNumber, {
      method: 'GET',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      }
    });
    try {
      const response = await fetch(request);
      if(response.status === 200) {
        const responseBody = await response.json();
        setCurrentPage(responseBody);  
      } else {
        alert("Error.");
        return;
      }
    } catch(error) {
      alert("Error.");
      return;
      }
  }

  const fetchMyPosts = async () => {
    const request = new Request(API_URL+'/api/post/my', {
      method: 'GET',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': currentState.token,
      }
    });
    try {
      const response = await fetch(request);
      if(response.status === 200) {
        const responseBody = await response.json();
        setMyPosts(responseBody);  
      } else if(response.status !== 400) {
        alert("Error.");
        return;
      }
    } catch(error) {
      alert("Error.");
      return;
      }
  }

  const pageNumberChangeHandler = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
  }

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
        setListOfItems(body.posts);     
      }
    } catch(error) {
      return;
    }
  }

  const onClickBest = () => {
    setViewType("best");
    setButtonBestVariant('primary');
    setButtonOthersVariant('outline-primary');
    setButtonMineVariant('outline-primary');
  }

  const onClickOthers = () => {
    setViewType("others");
    setButtonBestVariant('outline-primary');
    setButtonOthersVariant('primary');
    setButtonMineVariant('outline-primary');
  }

  const onClickMine = () => {
    if(currentState.isLoggedIn) {
      setViewType("mine");
      setButtonBestVariant('outline-primary');
      setButtonOthersVariant('outline-primary');
      setButtonMineVariant('primary');
    } else {
      alert("Only for logged users.");
    }
  }

  const deletePostFromList = (postId) => {
    setMyPosts(myPosts.filter((item) => {
      if(item._id === postId) {
        return false;
      } else {
        return true;
      }
    }));
  }

  const screenType = (window.innerWidth <= 768) ? 'mobile' : 'web';

  return (
      <StyledMainView>
        <StyledTopBar>
          <StyledTopButton variant={buttonBestVariant} onClick={onClickBest}>TOP</StyledTopButton>
          <StyledTopButton variant={buttonOthersVariant} onClick={onClickOthers}>Others</StyledTopButton>
          { currentState.isLoggedIn && 
            <StyledTopButton variant={buttonMineVariant} onClick={onClickMine}>My posts</StyledTopButton>
          }
        </StyledTopBar>
        { currentState.isLoggedIn && 
          <AddText currentState={currentState} buttonSubmitVariant='primary' screenType={screenType} />
        }
        <StyledBoardView isLoggedIn={currentState.isLoggedIn}>
          { (listOfItems && currentState.viewType === 'best') && 
            <ItemsList list={listOfItems} currentPageNumber={0} viewType={currentState.viewType} deletionEnabled={false} />
          }
          { (currentPage && currentState.viewType === 'others') &&
            <ItemsList list={currentPage} currentPageNumber={currentPageNumber} pageNumberChange={pageNumberChangeHandler} viewType={currentState.viewType} deletionEnabled={false} />
          }
          { (myPosts && currentState.viewType === 'mine') &&
            <ItemsList list={myPosts} currentPageNumber={0} viewType={currentState.viewType} deletionEnabled={true} deletePostFromList={deletePostFromList} />
          }
        </StyledBoardView>
      </StyledMainView>
  );

}