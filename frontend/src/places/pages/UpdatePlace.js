import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
//     address: '20 W 34th St, New York, NY 10001, United States',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u1'
//   },
//   {
//     id: 'p2',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
//     address: '20 W 34th St, New York, NY 10001, United States',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u2'
//   }
// ]

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(); 
  const history = useHistory();
  const auth = useContext(AuthContext); // get the auth context to get the userId
  // const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;
  
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`, 
        'PATCH', 
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }), 
        {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/places'); // redirect to the user places
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">  
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the place</h2>
        </Card>
      </div>
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
      <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 caracthers)"
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
      </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace