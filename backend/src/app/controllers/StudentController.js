import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  age: Yup.number().max(140),
  weight: Yup.number().max(400),
  height: Yup.number().max(3),
});

const RES_PER_PAGE = 10;

class StudentController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const students = await Student.findAll({
      where: q && { name: { [Op.iLike]: `%${q}%` } },
      order: ['id'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const studentsCount = await Student.count({
      where: q && { name: { [Op.iLike]: `%${q}%` } },
    });
    const totalPages = Math.ceil(studentsCount / RES_PER_PAGE);

    return res.json({
      docs: students,
      total: studentsCount,
      limit: RES_PER_PAGE,
      page: Number(page),
      pages: totalPages,
    });
  }

  async show(req, res) {
    const student = await Student.findOne({
      where: { id: req.params.id },
    });
    return res.json(student);
  }

  async store(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Validation fails.');
    }

    const { email } = req.body;

    const student = await Student.findByPk(req.params.id);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'Email cadastrado para esse aluno já existe' });
      }
    }

    const { id, name } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    Student.destroy({
      where: { id: req.params.id },
    });

    return res.json();
  }
}

export default new StudentController();
