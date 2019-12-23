import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = HelpOrder.findAll({
      where: { answer_at: null },
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

    const checkins = await HelpOrder.findAll({ student_id });

    return res.json(checkins);
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
