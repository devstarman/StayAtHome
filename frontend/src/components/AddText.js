import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

import { AppContext } from '../context/appContext';
import { API_URL } from '../constants';

const StyledMainView = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  max-height: 80px;
  width: 90%;
  background-color: #ddd;
  @media (max-width: 768px) {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 98%;
    background-color: #ddd; 
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const StyledUserView = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  padding-left: 20px;
  @media (max-width: 768px) {
    all: initial;
    padding-left: 5px;
    width: ${props => props.textFieldWidth}px;
    max-width: ${props => props.textFieldWidth}px;
  }
`;

const StyledNameView = styled.div`
  margin-left: 10px;
  margin-bottom: 0;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    all: initial;
    font-size: 14px;
    font-weight: bold;
    margin-left: 5px;
    margin-right: 10px;
  }
`;

const StyledNameAnnotationView = styled.div`
  margin-left: 4px;
  margin-bottom: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  width: 205px;
  min-width: 205px;
  max-width: 205px;
  @media (max-width: 768px) {
    margin-left: 4px;
    margin-bottom: 0px;
    font-size: 20px;
    display: flex;
    align-items: center;
    width: 150px;
    min-width: 150px;
    max-width: 150px;
  }
`;

const StyledInputView = styled.div`
  color: black;
  width: ${props => "calc(100% - " + props.width + "px)"};
`;

const StyledButtonContainer = styled.div`
  height: 100%;
  width: 100px;
  min-width: 100px;
  max-width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
  }
`;

const StyledButton = styled(Button)`
  margin: 10px;
  @media (max-width: 768px) {
    margin: 5px;
    padding: 3px;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 12px;
  }
`;

const StyledImage = styled.img`
  border-radius: 50%;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  @media (max-width: 768px) {
    height: 30px;
    max-height: 30px;
    width: 30px;
    max-width: 30px;
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  font-size: 18;
`;


export const AddText = (props) => {

    const { currentState } = React.useContext(AppContext);
    const [inputTextValue, setInputTextValue] = useState('');
    const [inputError, setInputError] = useState(false);
    const [inputErrorText, setInputErrorText] = useState('');
    const [textFocusStatus, setTextFocusStatus] = useState(false);

    const handleChangeInputTextValue = (event) => {
        if(event.target.value.length > 140) {
          setInputErrorText('Max 140 characters.');
          setInputError(true);
        } else {
          setInputErrorText('');
          setInputError(false);
          setInputTextValue(event.target.value);
        }
    }

    const submitHandler = async () => {
        const request = new Request(API_URL+'/api/post/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': currentState.token  
            },
            body: JSON.stringify({
                content: inputTextValue
            })
          });
          try {
            const response = await fetch(request);
            if(response.status === 200) {
                // toast dodano post
                setInputTextValue('');
                setInputErrorText('');
                setInputError(false);
            } else if(response.status === 400) {
              setInputErrorText('Only one post per day is allowed.');
              setInputError(true);
              return;
            } else if(response.status === 401) {
            }
          } catch(error) {
            return;
          }
    }

    const imgSize = 50;
    const textAnnotation = 230;
    let textFieldWidth = imgSize+textAnnotation+(props.currentState.name.length*11); // 11 is average letter width
    let inputFieldWidth = (textFieldWidth+110);
    const screenType = (window.innerWidth <= 768) ? 'mobile' : 'web';
    if(screenType === 'mobile') {
      textFieldWidth = 50+(props.currentState.name.length*6);
      inputFieldWidth = (textFieldWidth+50);
      if(textFocusStatus) {
        textFieldWidth = 0;
        inputFieldWidth = (textFieldWidth+50);
      }
    }

    const textFieldFocusHandler = () => {
      setTextFocusStatus(true);
    }

    const textFieldBlurHandler = () => {
      if(inputTextValue.length === 0) {
        setTextFocusStatus(false);
      }
    }

    return (
        <StyledMainView>
          { (screenType !== 'mobile' || (screenType === 'mobile' && textFocusStatus === false)) &&
            <StyledUserView textFieldWith={textFieldWidth}>
              <StyledImage size={imgSize} src={props.currentState.imageUrl} alt="Avatar" />
              <StyledNameView>{props.currentState.name}</StyledNameView>
              { screenType !== 'mobile' && 
                <StyledNameAnnotationView>is staying in home and: </StyledNameAnnotationView>
              }
            </StyledUserView>
          }
          <StyledInputView width={inputFieldWidth}>
            <StyledTextField
              id="standard-multiline-flexible"
              multiline
              value={inputTextValue}
              onChange={handleChangeInputTextValue}
              error={inputError}
              helperText={inputErrorText}
              InputProps={{
                style: (screenType === 'mobile' ? {fontSize: 12} : {fontSize: 18}),
              }}
              onFocus={textFieldFocusHandler}
              onBlur={textFieldBlurHandler}
            />
          </StyledInputView>
          <StyledButtonContainer>
            <StyledButton variant={props.buttonSubmitVariant} onClick={submitHandler}>POST</StyledButton>
          </StyledButtonContainer>
        </StyledMainView>
    );

}