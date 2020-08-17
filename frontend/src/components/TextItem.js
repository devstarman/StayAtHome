import React, {useState} from 'react';
import { MdDeleteForever } from 'react-icons/md';
import styled from 'styled-components';

import { API_URL } from '../constants';
import { AppContext } from '../context/appContext';
import arrowup from '../assets/arrowup.png';
import arrowdown from '../assets/arrowdown.png';
import errorimage from '../assets/errorImage.png';

const StyledMainView = styled.div`
    position: relative;
    height: 60px;
    min-height: 60px;
    width: 100%;
    background-color: #fafafa;
    border-radius: 10px;
    padding: 0px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    @media (max-width: 768px) {
        width: 100%;
        background-color: #fafafa;
        margin-top: 5px;
        margin-bottom: 15px;
        border-radius: 10px;
        min-height: 80px;
        max-height: 145px;
        padding: 6px 12px;
        display: flex;
        flex-direction: row;
    }
`;

const StyledPositionText = styled.p`
    margin-bottom: 0px;
    font-size: 22px;
    margin-left: 15px;
    font-weight: bold;
    @media (max-width: 768px) {
        height: 30px;
        font-size: 20px;
        margin-left: 0px;
    }
`;

const StyledArrowView = styled.div`
    margin-left: 20px;
    width: 30px;
    min-width: 30px;  
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0px;
        margin-right: 20px;
    }
`;

const StyledArrowContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const StyledArrowButton = styled.div`
    display: block;
    margin: 0px;
    padding: 0px;
    font-size: 0px;
    cursor: pointer;
    @media (max-width: 768px) {
        display: block;
        margin: 0;
        padding: 0; 
        font-size: 0px;
    }
`;

const StyledVoteValueContainer = styled.div`
    margin: 0px;
    padding: 0px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        margin: 0px;
        padding: 0px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const StyledImage = styled.img`
    margin-left: 25px;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    max-height: 50px;
    max-width: 50px;
    @media (max-width: 768px) {
        margin-left: 12px;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        max-height: 30px;
        max-width: 30px;
    }
`;

const StyledNameText = styled.p`
    margin: 0px;
    margin-left: 15px;
    font-size: 20px;
    font-weight: bold;
    @media (max-width: 768px) {
        margin-left: 10px;
        height: 24px;
        font-size: 16px;
    }
`;

const StyledUsersText = styled.p`
    margin: 0px;
    margin-left: 5px;
    font-size: 20px;
    @media (max-width: 768px) {
        display: flex;
        flexDirection: row;
        margin-left: 0px;
        font-size: 14px;
    }
`;

const StyledDeleteContainer = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    @media (max-width: 768px) {
        all: initial;
        margin-left: 10px;
        height: 30px;
    }
`;

const StyledDeleteButton = styled.div`
    cursor: pointer;
    color: blue;
`;

const StyledPostContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 17px);
`;

const StyledPostDescriptionContainer = styled.div`
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const StyledImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const TextItem = (props) => {

    const { currentState, setVotingUpFalse, setVotingDownFalse } = React.useContext(AppContext);
    const [voteValue, setVoteValue] = useState(props.voteValue);

    const voteUpHandler = () => {
        if(currentState.isLoggedIn) {
            if(currentState.allowedVotingUp) {
                sendVote("plus");
            } else {
                alert("Only one vote up per day is allowed.");
            }
        }
    }
  
    const voteDownHandler = () => {
        if(currentState.isLoggedIn) {
            if(currentState.allowedVotingDown) {
                sendVote("minus");
            } else {
                alert("Only one vote down per day is allowed.");
            }
        }
    }

    const sendVote = async (voteType) => {
        const request = new Request(API_URL+'/api/post/vote', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': currentState.token, 
            },
            body: JSON.stringify({
                postId: props.id,
                voteType: voteType
            })
          });
          try {
            const response = await fetch(request);
            if(response.status === 200) {
                if(voteType === 'plus') { 
                    setVoteValue(currValue => currValue+1);
                    // and disable upvote rights (action call)
                    setVotingUpFalse(); 
                } else if(voteType === 'minus') {
                    setVoteValue(currValue => currValue-1);
                    // and disable downvote rights (action call)
                    setVotingDownFalse(); 
                }
            } else {
                alert("Only one vote per day is allowed.");
                return;
            }
          } catch(error) {
            alert("Error.");
            return;
            }
    }

    const addDefaultSrc = (ev) => {
        ev.target.src = errorimage;
    }

    const deletePost = async () => {
        let confirmation = window.confirm("Are you sure? This action is irreversible.");
        if(confirmation) {
            deletePostOnServer();
            props.deletePostFromList(props.id);
        }
    }

    const deletePostOnServer = async () => {
        const request = new Request(API_URL+'/api/post/delete', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': currentState.token, 
            },
            body: JSON.stringify({
                postId: props.id,
            })
          });
          try {
            const response = await fetch(request);
            if(response.status === 200) {
            } else {
                alert("Error.");
                return;
            }
          } catch(error) {
            alert("Error.");
            return;
        }
    }

    const screenType = (window.innerWidth <= 768) ? 'mobile' : 'web';
    if(screenType === "mobile") {
        return (
          <StyledMainView>
            <StyledArrowView>
              <StyledArrowContainer>
                <StyledArrowButton onClick={voteUpHandler}>
                  <img src={arrowup} alt="arrow up" />
                </StyledArrowButton>
              </StyledArrowContainer>
              <StyledVoteValueContainer>
                {voteValue}
              </StyledVoteValueContainer>
              <StyledArrowContainer>
                <StyledArrowButton onClick={voteDownHandler}>
                  <img src={arrowdown} alt="arrow down" />
                </StyledArrowButton>
              </StyledArrowContainer>
            </StyledArrowView>
            <StyledPostContentsContainer>
              <StyledPostDescriptionContainer>
                <StyledPositionText>
                  #{props.position}
                </StyledPositionText>
                <StyledImageContainer>
                  <StyledImage src={props.imageUrl} onError={addDefaultSrc} alt="Avatar" />
                </StyledImageContainer>
                <StyledNameText>
                  {props.name}
                </StyledNameText>
                { props.deletionEnabled && (
                    <StyledDeleteContainer>
                      <StyledDeleteButton onClick={deletePost}>
                        <MdDeleteForever size={30} />
                      </StyledDeleteButton>
                    </StyledDeleteContainer>
                  )
                }
              </StyledPostDescriptionContainer>
              <StyledUsersText>
                {props.text}
              </StyledUsersText>
            </StyledPostContentsContainer>
          </StyledMainView>
        );
    }

    return (
        <StyledMainView>
            <StyledPositionText>#{props.position}</StyledPositionText>
            <StyledArrowView>
                <StyledArrowContainer>
                    <StyledArrowButton onClick={voteUpHandler}>
                        <img src={arrowup} alt="arrow up" />
                    </StyledArrowButton>
                </StyledArrowContainer>
                <StyledVoteValueContainer>{voteValue}</StyledVoteValueContainer>
                <StyledArrowContainer>
                    <StyledArrowButton onClick={voteDownHandler}>
                        <img src={arrowdown} alt="arrow down" />
                    </StyledArrowButton>
                </StyledArrowContainer>
            </StyledArrowView>
            <StyledImage src={props.imageUrl} onError={addDefaultSrc} alt="Avatar" />
            <StyledNameText>{props.name}</StyledNameText>
            <StyledUsersText>{props.text}</StyledUsersText>
            { props.deletionEnabled && 
                <StyledDeleteContainer>
                    <StyledDeleteButton onClick={deletePost}>
                        <MdDeleteForever size={30} />
                    </StyledDeleteButton>
                </StyledDeleteContainer>
            }
        </StyledMainView>
    );

}