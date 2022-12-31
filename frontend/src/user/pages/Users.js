import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  // const USERS = [
  //   {
  //     id: 'u1', 
  //     name: 'Max Schwarz', 
  //     image: 'https://github.com/Robert-octavo/holbertonschool-web_front_end/blob/master/0x02-CSS_advanced/images/pic-person-03.jpg?raw=true', 
  //     places: 3,
  //   },
  //   {
  //     id: 'u2', 
  //     name: 'Lin Schwarz', 
  //     image: 'https://github.com/Robert-octavo/holbertonschool-web_front_end/blob/master/0x02-CSS_advanced/images/pic-person-02.jpg?raw=true', 
  //     places: 4,
  //   },
  // ]

  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  // const USERS = []
  // Use the fetch API to get the users from the backend server and store them in USERS
  // UseEffect is a hook that runs after the component is rendered for the first time and after every update of the component (when the state changes) 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');
        setLoadedUsers(responseData.users);
      } catch (err) {} //the error is handled by the useHttpClient hook
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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