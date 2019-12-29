import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Student from '../models/Student';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const { id } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(401).json({ error: 'Usuário não localizado' });
    }

    return res.json({
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
