import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import AdminManager from './components/admin/AdminManager';
import LoginPage from './components/auth/LoginPage';
import ListClasses from './components/class/listClasses';
import ListUsers from './components/users/listUsers';
import './index.css';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  
  <ToastProvider>
    <Router>
    <Route exact path="/" component={AdminManager}></Route>
    <Route path="/login" component={LoginPage}></Route>
    <Route path="/listUsers" component={ListUsers}></Route>
    <Route path="/listClasses" component={ListClasses}></Route>
  </Router>
  </ToastProvider>,
  document.getElementById('root')
);

reportWebVitals();
