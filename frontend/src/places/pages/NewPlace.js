import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // useHttpClient is a custom hook
  const [formState, inputHandler] = useForm(
    { 
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  // const descriptionInputHandler = useCallback((id, value, isValid) => {
  //   console.log(id, value, isValid);
  // }, []);

  const history = useHistory(); // useHistory is a react hook that returns an object with a push method that we can use to redirect the user to a different page in the app
  const placeSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend
    try {
      const formData = new FormData(); // FormData is a built-in browser API
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);
      await sendRequest(
        'http://localhost:5000/api/places', 
        'POST', 
        formData
      );
      history.push('/'); // redirect the user to the root page
    } catch (err) {} // error is handled by the useHttpClient hook
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" action="" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />} {/* show the spinner */}
        <Input 
          id="title"
          element="input" 
          type="text" 
          label="Title" 
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
        />
        <Input 
          id="description"
          element="textarea" 
          label="Title" 
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 caracthers)"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </React.Fragment>
  )
}

export default NewPlace;