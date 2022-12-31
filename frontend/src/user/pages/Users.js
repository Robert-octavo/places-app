import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const USERS = [
    {
      id: 'u1', 
      name: 'Max Schwarz', 
      image: 'https://github.com/Robert-octavo/holbertonschool-web_front_end/blob/master/0x02-CSS_advanced/images/pic-person-03.jpg?raw=true', 
      places: 3,
    },
    {
      id: 'u2', 
      name: 'Lin Schwarz', 
      image: 'https://github.com/Robert-octavo/holbertonschool-web_front_end/blob/master/0x02-CSS_advanced/images/pic-person-02.jpg?raw=true', 
      places: 4,
    },
  ]

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  // const USERS = []
  // Use the fetch API to get the users from the backend server and store them in USERS
  // UseEffect is a hook that runs after the component is rendered for the first time and after every update of the component (when the state changes) 
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  )
}

export default Users