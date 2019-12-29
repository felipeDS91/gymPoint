import * as Yup from 'yup';
import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

const RES_PER_PAGE = 20;

class HelpOrderController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const helpOrders = await HelpOrder.findAll({
      order: ['id'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
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
    const { page = 1 } = req.query;

    const helpOrder = await HelpOrder.findAll({
      order: [['id', 'DESC']],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
      where: { student_id },
    });

    // Count how many rows were found
    const helpOrderCount = await HelpOrder.count({ student_id });
    const totalPages = Math.ceil(helpOrderCount / RES_PER_PAGE);

    return res.json({
      docs: helpOrder,
      total: helpOrderCount,
      limit: RES_PER_PAGE,
      page,
      pages: totalPages,
    });
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
