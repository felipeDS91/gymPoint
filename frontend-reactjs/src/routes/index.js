import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import ListStudents from '../pages/ListStudents';
import FormStudent from '../pages/FormStudent';
import Profile from '../pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/list-students" component={ListStudents} isPrivate />
      <Route path="/form-student" component={FormStudent} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
}
