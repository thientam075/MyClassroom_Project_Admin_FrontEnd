import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import AdminManager from './components/admin/AdminManager';
import LoginPage from './components/auth/LoginPage';
import ListUsers from './components/users/listUsers';
import ListClasses from './components/class/listClasses';
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
