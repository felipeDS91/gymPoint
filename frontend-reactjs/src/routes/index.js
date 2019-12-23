import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import ListStudents from '~/pages/List/Student';
import FormStudent from '~/pages/Form/Student';
import ListPlans from '~/pages/List/Plan';
import FormPlan from '~/pages/Form/Plan';
import ListRegistrations from '~/pages/List/Registration';
import FormRegistration from '~/pages/Form/Registration';

// Remover
import Profile from '../pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />
      <Route path="/list-students" component={ListStudents} isPrivate />
      <Route path="/student" exact component={FormStudent} isPrivate />
      <Route path="/student/:id" exact component={FormStudent} isPrivate />

      <Route path="/list-plans" component={ListPlans} isPrivate />
      <Route path="/plan" exact component={FormPlan} isPrivate />
      <Route path="/plan/:id" exact component={FormPlan} isPrivate />

      <Route
        path="/list-registrations"
        component={ListRegistrations}
        isPrivate
      />
      <Route
        path="/registration"
        exact
        component={FormRegistration}
        isPrivate
      />
      <Route
        path="/registration/:id"
        exact
        component={FormRegistration}
        isPrivate
      />

      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
}
