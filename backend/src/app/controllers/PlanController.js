import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

const schema = Yup.object().shape({
  title: Yup.string().required(),
  duration: Yup.number().required(),
  price: Yup.number().required(),
});

class PlanController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const plans = await Plan.findAll({
      where: q && { title: { [Op.iLike]: `%${q}%` } },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(plans);
  }

  async show(req, res) {
    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });
    return res.json(plan);
  }

  async store(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) return res.status(400).json({ error: 'Plano já existe' });

    const { id, title } = await Plan.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  async update(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const { title } = req.body;

    const plan = await Plan.findByPk(req.params.id);

    if (title !== plan.title) {
      const planExists = await Plan.findOne({ where: { title } });

      if (planExists) return res.status(400).json({ error: 'Plano já existe' });
    }

    const { id } = await plan.update(req.body);

    return res.json({
      id,
      title,
    });
  }

  async delete(req, res) {
    Plan.destroy({
      where: { id: req.params.id },
    });

    return res.json();
  }
}

export default new PlanController();
