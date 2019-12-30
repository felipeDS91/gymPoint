import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { format, parseISO, addMonths } from 'date-fns';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AsyncSelect from '~/components/AsyncSelect';
import Select from '~/components/Select';
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
  student: Yup.object({
    id: Yup.number().required(),
    name: Yup.string().required(),
  })
    .nullable()
    .required('Campo aluno obrigatório'),
  plan_id: Yup.string().required('O plano é obrigatório'),
  start_date: Yup.date()
    .required('Campo data de início obrigatório')
    .typeError('Campo data inválida'),
});

export default function FormStudent({ history, match }) {
  const { id } = match.params;
  const [editMode] = useState(typeof id !== 'undefined');
  const [enrollment, setEnrollment] = useState({});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentPromise = value =>
    api
      .get('/students', {
        params: {
          q: value,
        },
      })
      .then(({ data }) => data)
      .catch(() => []);

  async function loadPlans() {
    const response = await api.get(`/plans`);
    const { data } = response;

    const dataFormatted = data.map(item => ({
      id: item.id,
      title: item.title,
      price_total: formatPrice(item.duration * item.price),
      duration: item.duration,
    }));

    setPlans(dataFormatted);
  }

  async function loadData() {
    await loadPlans();

    if (!editMode) {
      setLoading(false);
      return;
    }

    const response = await api.get(`/enrollments/${id}`);

    const startDateFormatted = parseISO(response.data.start_date);

    const endDateDateFormatted = format(
      parseISO(response.data.end_date),
      "dd'/'MM'/'yyyy"
    );

    const data = {
      ...response.data,
      plan_id: response.data.plan.id,
      student_id: response.data.student.id,
      start_date: startDateFormatted,
      end_date: endDateDateFormatted,
      price_total: formatPrice(response.data.price),
    };

    setEnrollment(data);
    setLoading(false);
  }

  async function handleSubmit(data) {
    const postData = {
      student_id: data.student.id,
      plan_id: data.plan_id,
      start_date: data.start_date,
    };

    try {
      if (editMode) {
        await api.put(`enrollments/${id}`, postData);
      } else {
        await api.post('enrollments', postData);
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

  useEffect(() => {
    if (enrollment.plan_id) {
      const plan = plans.find(item => item.id === enrollment.plan_id);
      setEnrollment({
        ...enrollment,
        ...(enrollment.start_date && {
          end_date: format(
            addMonths(enrollment.start_date, plan.duration),
            "dd'/'MM'/'yyyy"
          ),
        }),
        price_total: plan.price_total,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment.plan_id, enrollment.start_date]);

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
          <AsyncSelect
            name="student"
            label="ALUNO"
            loadOptions={studentPromise}
            placeholder="Selecione o aluno"
            noOptionsMessage={() => 'Nenhum aluno encontrado'}
            loadingMessage={() => 'Carregando...'}
            getOptionLabel={option => option.name}
            getOptionValue={option => option}
            defaultOptions
            onChange={value => setEnrollment({ ...enrollment, student: value })}
            value={enrollment.student}
          />

          <Columns>
            <div>
              <Select
                name="plan_id"
                label="PLANO"
                placeholder="Buscar plano"
                options={plans}
                onChange={e => {
                  setEnrollment({
                    ...enrollment,
                    plan_id: e.id,
                  });
                }}
              />
            </div>
            <div>
              <DatePicker
                label="DATA DE INÍCIO"
                name="start_date"
                onChange={date => {
                  setEnrollment({
                    ...enrollment,
                    start_date: date,
                  });
                }}
              />
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
                name="price_total"
              />
            </div>
          </Columns>
        </Form>
      )}
    </Container>
  );
}
