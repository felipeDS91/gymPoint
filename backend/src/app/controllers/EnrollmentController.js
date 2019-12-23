import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, format } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'age', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollments = await Enrollment.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },

        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price'],
        },
      ],
    });
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const { student_id, plan_id } = req.body;

    const checkStudent = await Student.findOne({
      where: { id: student_id },
    });

    if (!checkStudent) {
      return res.status(401).json({ error: "Student doesn't has a valid id" });
    }

    const startDate = parseISO(req.body.start_date);

    /* verify if dates is before (valid)  */
    if (isBefore(startDate, new Date())) {
      return res.status(400).json({
        error: 'past dates are not permitted',
      });
    }

    /* Check if student have enrollments   */
    const checkEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        start_date: startDate,
      },
    });

    if (checkEnrollment) {
      return res.status(401).json({ error: 'Enrollment is not available' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
      attributes: ['title', 'duration', 'price'],
    });

    if (!plan) {
      return res.status(401).json({ error: "Plan doesn't exist" });
    }

    /* Calculate value of price */
    const totalPrice = (await plan.price) * plan.duration;

    /* Calculate final date */
    const finalDate = addMonths(startDate, plan.duration);

    const createdEnrolment = await Enrollment.create({
      plan_id,
      student_id,
      start_date: startDate,
      end_date: finalDate,
      price: totalPrice,
    });

    const student = await Student.findOne({
      where: { id: student_id },
      attributes: ['name', 'email'],
    });

    await Queue.add(EnrollmentMail.key, {
      studentName: student.name,
      studentEmail: student.email,
      plan: plan.title,
      end_date: format(finalDate, 'dd/MM/yyyy'),
      price: totalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    });

    return res.json(createdEnrolment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, plan_id } = req.body;

    const checkEnrolls = await Student.findOne({
      where: { id: student_id },
      attributes: ['name', 'email'],
    });

    if (!checkEnrolls) {
      return res.status(401).json({ error: "Student doesn't has a valid id" });
    }

    const startDate = parseISO(req.body.start_date);

    /* verify if dates is before (valid)  */
    if (isBefore(startDate, new Date())) {
      return res.status(400).json({
        error: 'past dates are not permitted',
      });
    }

    /* Check if student already has enrollment   */
    const checkEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        start_date: startDate,
      },
    });

    if (checkEnrollment) {
      return res
        .status(401)
        .json({ error: 'Student already done this enrollment' });
    }

    const planExists = await Plan.findOne({
      where: { id: plan_id },
      attributes: ['title', 'duration', 'price'],
    });

    if (!planExists) {
      return res
        .status(401)
        .json({ error: 'Plans does not exist, please careful' });
    }

    /* Verify if enrollment exists  */
    const enrollmentUpdate = await Enrollment.findOne({
      where: { id: req.params.id },
    });

    if (!enrollmentUpdate) {
      return res.status(400).json({ error: 'Enrollment not find' });
    }

    /* Calculate value of price */
    const totalPrice = await (planExists.price * planExists.duration);

    /* Calculate final date */
    const finalDate = addMonths(startDate, planExists.duration);

    await enrollmentUpdate.update({
      plan_id,
      student_id,
      start_date: startDate,
      end_date: finalDate,
      price: totalPrice,
    });
    return res.json(enrollmentUpdate);
  }

  async delete(req, res) {
    const enrollmentDelete = await Enrollment.findOne({
      where: { id: req.params.id },
    });

    if (!enrollmentDelete) {
      return res.status(400).json({ error: 'Enrollment not exists' });
    }

    await enrollmentDelete.destroy({
      where: { id: enrollmentDelete },
    });

    return res.json({ message: 'Enrollment deleted with success' });
  }
}

export default new EnrollmentController();
