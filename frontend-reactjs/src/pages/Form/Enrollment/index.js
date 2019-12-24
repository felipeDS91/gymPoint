import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { Form, Select } from '@rocketseat/unform';
// import Select from '~/components/Select';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Input from '~/components/Input';

import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  BackButton,
  SaveButton,
} from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  age: Yup.string().required('A idade é obrigatória'),
  weight: Yup.string().required('O peso é obrigatório'),
  height: Yup.string().required('A altura é obrigatória'),
});

export default function FormStudent({ history, match }) {
  const { id } = match.params;
  const [editMode] = useState(typeof id !== 'undefined');
  const [enrollment, setEnrollment] = useState({});
  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);

  async function loadStudents() {
    const response = await api.get(`/students`);
    const { data } = response;

    const dataFormatted = data.map(item => ({
      id: item.id,
      title: item.name,
    }));

    setStudents(dataFormatted);
  }

  async function loadPlans() {
    const response = await api.get(`/plans`);
    const { data } = response;

    const dataFormatted = data.map(item => ({
      id: item.id,
      title: item.title,
    }));

    setPlans(dataFormatted);
  }

  async function loadData() {
    loadStudents();
    loadPlans();

    const response = await api.get(`/enrollments/${id}`);
    const { data } = response;

    console.log(data);

    setEnrollment(data);
  }

  /**
   * Fields with property "mask" were not working
   */
  function handleChange(event) {
    event.persist();
    setEnrollment(data => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(data) {
    console.log(data);
    return;
    try {
      const clearData = {
        ...data,
      };

      if (editMode) {
        await api.put(`enrollments/${id}`, clearData);
      } else {
        await api.post('enrollments', clearData);
      }

      toast.success('Dados gravados com sucesso!');
      history.push('/list-enrollments');
    } catch (error) {
      console.log(error);
      toast.error('Não foi possivel gravar os dados!');
    }
  }

  useEffect(() => {
    loadData();

    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <PageHeader>
        <TitlePage>
          {editMode ? 'Edição de matrícula' : 'Cadastro de matrícula'}
        </TitlePage>
        <Options>
          <BackButton type="button" onClick={history.goBack}>
            <IoIosArrowBack size={16} color="#FFF" />
            VOLTAR
          </BackButton>
          <SaveButton type="submit" form="form">
            <IoIosCheckmark size={26} color="#FFF" />
            SALVAR
          </SaveButton>
        </Options>
      </PageHeader>

      <Form
        id="form"
        initialData={enrollment}
        // schema={schema}
        onSubmit={handleSubmit}
      >
        <Select
          name="student"
          label="ALUNO"
          selected={{ id: 5, title: 'Mariane Pataro' }}
          placeholder="Buscar aluno"
          options={students}
        />

        <div>
          <div>
            <Select
              name="plans"
              label="PLANO"
              placeholder="Buscar plano"
              options={plans}
            />
          </div>
          <div>
            <Input
              type="text"
              label="DATA DE INÍCIO"
              name="date_start"
              value={enrollment.weight}
              onChange={handleChange}
              placeholder="Data de início"
            />
          </div>
          <div>
            <Input
              type="text"
              label="DATA DE TÉRMINO"
              name="date_end"
              value={enrollment.height}
              onChange={handleChange}
              placeholder="Data de término"
            />
          </div>
          <div>
            <Input
              type="text"
              label="VALOR FINAL"
              name="finalPrice"
              value={enrollment.height}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form>
    </Container>
  );
}
