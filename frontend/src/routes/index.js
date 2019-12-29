import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';

import ListStudents from '~/pages/List/Student';
import FormStudent from '~/pages/Form/Student';
import ListPlans from '~/pages/List/Plan';
import FormPlan from '~/pages/Form/Plan';
import ListEnrollments from '~/pages/List/Enrollment';
import FormEnrollment from '~/pages/Form/Enrollment';
import ListHelpOrdes from '~/pages/List/HelpOrder';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/list-students" component={ListStudents} isPrivate />
      <Route path="/student" exact component={FormStudent} isPrivate />
      <Route path="/student/:id" exact component={FormStudent} isPrivate />

      <Route path="/list-plans" component={ListPlans} isPrivate />
      <Route path="/plan" exact component={FormPlan} isPrivate />
      <Route path="/plan/:id" exact component={FormPlan} isPrivate />

      <Route path="/list-enrollments" component={ListEnrollments} isPrivate />
      <Route path="/enrollment" exact component={FormEnrollment} isPrivate />
      <Route
        path="/enrollment/:id"
        exact
        component={FormEnrollment}
        isPrivate
      />

      <Route path="/list-help-orders" component={ListHelpOrdes} isPrivate />
    </Switch>
  );
}
