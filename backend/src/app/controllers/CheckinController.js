import * as Yup from 'yup';
import { Op } from 'sequelize';
import { endOfDay, startOfDay, format, subDays, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';

const CHECKINS_PER_WEEK = 5;
const RES_PER_PAGE = 10;

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json('Validation fails.');
    }

    const { student_id } = req.params;

    const checkins = await Checkin.findAll({
      order: [['id', 'DESC']],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
      where: { student_id },
    });

    // Count how many rows were found
    const checkinsCount = await Checkin.count({ student_id });
    const totalPages = Math.ceil(checkinsCount / RES_PER_PAGE);

    return res.json({
      docs: checkins,
      total: checkinsCount,
      limit: RES_PER_PAGE,
      page: Number(page),
      pages: totalPages,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json('Validation fails.');
    }

    const { student_id } = req.params;
    const startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const checkinCount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(parseISO(startDate)), endOfDay(new Date())],
        },
      },
    });

    if (checkinCount >= CHECKINS_PER_WEEK) {
      return res.status(400).json({
        error: `Usuário já realizou o máximo de ${CHECKINS_PER_WEEK} checkins permitidos nessa semana.`,
      });
    }

    const { id } = await Checkin.create(req.params);

    return res.json({ id });
  }
}

export default new CheckinController();
