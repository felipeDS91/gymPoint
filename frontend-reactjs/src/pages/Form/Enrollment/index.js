import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { format, parseISO } from 'date-fns';
import { Form, Select, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
// import Input from '~/components/Input';
// import Select from '~/components/Select';
import DatePicker from '~/components/DatePicker';

import { formatPrice } from '~/util/format';
import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  BackButton,
  SaveButton,
  Columns,
} from './styles';

const schema = Yup.object().shape({
  student_id: Yup.number()
    .integer()
    .required('O aluno é obrigatório'),
  plan_id: Yup.number()
    .integer()
    .required('O plano é obrigatório'),
  start_date: Yup.date().required('A data é obrigatória'),
});

export default function FormStudent({ history, match }) {
  const { id } = match.params;
  const [editMode] = useState(typeof id !== 'undefined');
  const [enrollment, setEnrollment] = useState({});
  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const startDateFormatted = parseISO(response.data.start_date);

    const endDateDateFormatted = format(
      parseISO(response.data.end_date),
      "dd'/'MM'/'yyyy"
    );

    const data = {
      ...response.data,
      plan_id: response.data.plan.title,
      student_id: response.data.student.id,
      start_date: startDateFormatted,
      end_date: endDateDateFormatted,
      priceTotal: formatPrice(response.data.price),
    };

    setEnrollment(data);
    setLoading(false);
  }

  async function handleSubmit(data) {
    try {
      if (editMode) {
        await api.put(`enrollments/${id}`, data);
      } else {
        await api.post('enrollments', data);
      }

      toast.success('Dados gravados com sucesso!');
      history.push('/list-enrollments');
    } catch ({ response }) {
      toast.error(response.data.error || 'Não foi possivel gravar os dados!');
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

      {!loading && (
        <Form
          id="form"
          initialData={enrollment}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Select
            name="student_id"
            label="ALUNO"
            placeholder="Buscar aluno"
            options={students}
          />

          <Columns>
            <div>
              <Select
                name="plan_id"
                label="PLANO"
                placeholder="Buscar plano"
                options={plans}
              />
            </div>
            <div>
              <DatePicker label="DATA DE INÍCIO" name="start_date" />
            </div>
            <div>
              <Input
                disabled
                type="text"
                label="DATA DE TÉRMINO"
                name="end_date"
                placeholder="Data de término"
              />
            </div>
            <div>
              <Input
                disabled
                type="text"
                label="VALOR FINAL"
                name="priceTotal"
              />
            </div>
          </Columns>
        </Form>
      )}
    </Container>
  );
}
