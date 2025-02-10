import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/Users/UserList';
import CreateUser from './components/Users/CreateUser';
import EditUser from './components/Users/EditUser';
import Home from './components/Home/Home';
import CreateTask from './components/Tasks/CreateTasks';
import EditTask from './components/Tasks/EditTasks';
import ProjectList from './components/Projects/ProjectsList';
import CreateProject from './components/Projects/CreateProjetects';
import EditProject from './components/Projects/EditProjects';
import TaskList from './components/Tasks/TasksList';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/create" element={<CreateUser />} />
      <Route path="/users/edit/:userId" element={<EditUser />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/create" element={<CreateTask />} />
      <Route path="/tasks/edit/:taskId" element={<EditTask />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/create" element={<CreateProject />} />
      <Route path="/projects/edit/:projectId" element={<EditProject />} />
      </Routes>
    </Router>
  );
};

export default App;
