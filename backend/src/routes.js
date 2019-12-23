import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import authMiddleware from './app/middlewares/auth';
import adminOnly from './app/middlewares/adminOnly';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', adminOnly, PlanController.index);
routes.post('/plans', adminOnly, PlanController.store);
routes
  .route('/plans/:id', adminOnly)
  .get(PlanController.show)
  .put(PlanController.update)
  .delete(PlanController.delete);

routes.get('/enrollments', adminOnly, EnrollmentController.index);
routes.post('/enrollments', adminOnly, EnrollmentController.store);
routes
  .route('/enrollments/:id', adminOnly)
  .get(EnrollmentController.show)
  .put(EnrollmentController.update)
  .delete(EnrollmentController.delete);

routes
  .route('/students/:student_id/checkins')
  .get(CheckinController.index)
  .post(CheckinController.store);

routes
  .route('/students/:student_id/help-orders')
  .get(HelpOrderController.show)
  .post(HelpOrderController.store);

routes.post('/help-orders/:id/answer', AnswerController.store);
routes.get('/help-orders/:id/answer', AnswerController.index);

export default routes;
