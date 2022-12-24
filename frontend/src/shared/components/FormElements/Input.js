import React, { useReducer } from 'react';

import { validate } from '../../util/validators';

import './Input.css'

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state, // This is the spread operator, it copies the state object and then overwrites the value and isValid properties
        value: action.val,
        isValid: validate(action.val, action.validators)
      }
    case 'TOUCH':
      return {
        ...state,
        isTouched: true
      }
    default:
      return state
  }
}


const Input = props => {

  const [inputState, dispatch] = useReducer(inputReducer, {value: '', isTouched: false, isValid: false}); // This is a hook that allows us to use the reducer function

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE', 
      val: event.target.value, 
      validators: props.validators});
    
    //This is the dispatch function that is called when the input changes (i.e. when the user types in the input field or text area). It takes an action object as an argument. The action object has a type property which is a string that describes the action that is being performed. In this case, the action is 'CHANGE'. The action object also has a val property which is the value of the input field or text area (i.e. the value of the event.target.value property). The dispatch function then calls the reducer function with the action object as an argument. The reducer function then returns a new state object (i.e. the new value and isValid properties of the inputState object). The dispatch function then updates the inputState object with the new state object (i.e. the new value and isValid properties of the inputState object). The dispatch function then calls the inputHandler function (i.e. the function that is passed in as a prop to the Input component) with the new state object (i.e. the new value and isValid properties of the inputState object) as an argument. The inputHandler function then updates the state of the form component (i.e. the state of the form component is updated with the new value and isValid properties of the inputState object). The form component then re-renders and the new value and isValid properties of the inputState object are passed to the Input component as props. The Input component then re-renders and the new value and isValid properties of the inputState object are displayed in the input field or text area. The inputHandler function is also called when the form is submitted. The inputHandler function then updates the state of the form component (i.e. the state of the form component is updated with the new value and isValid properties of the inputState object). The form component then re-renders and the new value and isValid properties of the inputState object are passed to the Input component as props. The Input component then re-renders and the new value and isValid properties of the inputState object are displayed in the input field or text area. The inputHandler function is also called when the form is submitted. The inputHandler function then updates the state of the form component (i.e. the state of the form component is updated with the new value and isValid properties of the inputState object). The form component then re-renders and the new value and isValid properties of the inputState object are passed to the Input component as props. The Input component then re-renders and the new value and isValid properties of the inputState object are displayed in the input field or text area. 
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  const element = 
    props.element === 'input' ? ( 
      <input 
        id={props.id} 
        type={props.type} 
        placeholder={props.placeholder} 
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea 
        id={props.id} 
        rows={props.rows || 3} 
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  )
}

export default Input