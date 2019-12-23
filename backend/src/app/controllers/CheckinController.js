import * as Yup from 'yup';
import { Op } from 'sequelize';
import { endOfDay, startOfDay, format, subDays, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';

const CHECKINS_PER_WEEK = 5;

class CheckinController {
  async index(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json('Validation fails.');
    }

    const { student_id } = req.params;

    const checkins = await Checkin.findAll({ student_id });

    return res.json(checkins);
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
        error: `User already done ${CHECKINS_PER_WEEK} checkins these week.`,
      });
    }

    const { id } = await Checkin.create(req.params);

    return res.json({ id });
  }
}

export default new CheckinController();
