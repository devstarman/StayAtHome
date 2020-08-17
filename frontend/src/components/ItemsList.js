import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styled from 'styled-components';

import { API_URL } from '../constants';
import { TextItem } from './TextItem';

const StyledList = styled.ul`
    list-style-type: none;
    margin: 0px;
    padding: 0px;
`;

const StyledBoardNavigationBar = styled.div`
    height: 50px;
    min-height: 50px;
    max-height: 50px;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const StyledArrowButton = styled.div`
    cursor: pointer;
`;

const StyledText = styled.p`
    font-size: 24px;
    font-weight: bold;
    padding: 5px;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0px;
`;

export const ItemsList = (props) => {

    let additionalPageNumberValue = 0;
    if(props.currentPageNumber > 0) {
        additionalPageNumberValue += props.currentPageNumber*50;
    }

    const changePage = async (direction) => {
        if(direction === 'left') {
            if(props.currentPageNumber > 1) {
                props.pageNumberChange(props.currentPageNumber-1);
            }
        } else if(direction === 'right') {
            const request = new Request(API_URL+'/api/post/pageNo', {
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
                  if(props.currentPageNumber < body.pageNo) {
                    props.pageNumberChange(props.currentPageNumber+1);
                  }   
                }
              } catch(error) {
                return;
            }
        }
    }

    if(props.list.length > 0) {
        return (
            <div>
                <StyledList>
                    {props.list.map((item, index) => {
                        return <li key={item._id}>
                            <TextItem
                                id={item._id} 
                                position={props.viewType === 'mine' ? item.ranking : (index+1+additionalPageNumberValue)}
                                voteValue={item.points} 
                                name={item.userId.firstName} 
                                imageUrl={item.userId.imageUrl} 
                                text={item.content}
                                deletionEnabled={props.deletionEnabled}
                                deletePostFromList={props.deletePostFromList} 
                            />
                        </li>
                    })}
                </StyledList>
                { props.viewType === 'others' && 
                    <StyledBoardNavigationBar>
                        <StyledArrowButton onClick={() => changePage('left')}><FaArrowLeft size={30} /></StyledArrowButton>
                        <StyledText>{props.currentPageNumber}</StyledText>
                        <StyledArrowButton onClick={() => changePage('right')}><FaArrowRight size={30} /></StyledArrowButton>
                    </StyledBoardNavigationBar>
                }
            </div>
        );
    } else {
        return (
            <div></div>
        );
    }

}