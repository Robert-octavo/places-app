import React from 'react';
import UsersList from '../components/UsersList';

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
  // const USERS = []
  return (
    <UsersList items={USERS} />
  )
}

export default Users