import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const helpOrders = await HelpOrder.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      where: { answer_at: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
          where: q && { name: { [Op.iLike]: `%${q}%` } },
        },
      ],
    });

    return res.json(helpOrders);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json('Validation fails.');
    }

    const { student_id } = req.params;
    const { page = 1, q } = req.query;

    const helpOrder = await HelpOrder.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      where: { student_id },
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const { student_id } = req.params;

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      question: Yup.string().required(),
    });

    if (!(await schema.isValid({ ...req.body, student_id }))) {
      return res.status(400).json('Validation fails.');
    }

    const { id } = await HelpOrder.create({ ...req.body, student_id });

    return res.json({ id });
  }
}

export default new HelpOrderController();
