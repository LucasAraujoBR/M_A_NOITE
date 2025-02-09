import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/users" exact component={UserList} />
        <Route path="/users/create" component={CreateUser} />
        <Route path="/users/edit/:userId" component={EditUser} />
      </Routes>
    </Router>
  );
};

export default App;
