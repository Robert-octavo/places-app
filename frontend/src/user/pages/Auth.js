import React, { useState, useContext } from 'react';

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext); // auth is an object with isLoggedIn, login, and logout
  const [isLoginMode, setIsLoginMode] = useState(true); // true means that we are in login mode
  const [isLoading, setIsLoading] = useState(false); // loading state for the spinner
  const [error, setError] = useState(); // error state for the error message

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );  // false means that the form is not valid

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    // console.log(formState.inputs); // send this to the backend!
    setIsLoading(true); // show the spinner

    if (isLoginMode) {
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false); // hide the spinner
        auth.login();
      } catch (err) {
        setIsLoading(false); // hide the spinner
        setError(err.message || 'Something went wrong, please try again.');
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        console.log(responseData);
        setIsLoading(false); // hide the spinner
        auth.login();
      } catch (err) {
        console.log(err);
        setIsLoading(false); // hide the spinner
        setError(err.message || 'Something went wrong, please try again.');
      }
    }
    
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />} {/* show the spinner */}
        <h2>Login Required</h2>
        <hr />
        <form action="" onSubmit={authSubmitHandler}> {/* onSubmit is a built-in event */}
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ?  'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  )
}

export default Auth