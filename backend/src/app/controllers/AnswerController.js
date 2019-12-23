import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import AnswerHelpOrderMail from '../jobs/AnswerHelpOrderMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      attributes: ['id', 'question', 'student_id', 'answer', 'answer_at'],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exist' });
    }

    if (helpOrder.answer_at) {
      return res.status(400).json({ error: 'Help order already answered' });
    }

    const student = await Student.findByPk(helpOrder.student_id, {
      attributes: ['name', 'email'],
    });

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { answer } = req.body;
    const answer_at = new Date();

    const answerHelpOrder = await HelpOrder.update(
      {
        answer,
        answer_at,
        student_id: helpOrder.student_id,
      },
      { where: { id } }
    );

    await Queue.add(AnswerHelpOrderMail.key, {
      studentName: student.name,
      studentEmail: student.email,
      question: helpOrder.question,
      answer,
    });

    return res.json(answerHelpOrder);
  }

  async index(req, res) {
    const { id } = req.params;

    const help_orders = await HelpOrder.findAll({
      where: { id },
      attributes: ['id', 'question', 'student_id', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(help_orders);
  }
}

export default new AnswerController();
