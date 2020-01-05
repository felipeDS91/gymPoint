import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { Form } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import history from '~/services/history';
import Input from '~/components/Input';
import { formatPrice } from '~/util/format';
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
  title: Yup.string().required('O título é obrigatório'),
  duration: Yup.number()
    .integer()
    .required('A duração é obrigatória'),
  price: Yup.number().required('O valor é obrigatório'),
});

export default function FormPlan({ match }) {
  const { id } = match.params;
  const [editMode] = useState(typeof id !== 'undefined');
  const [plan, setPlan] = useState({});
  const [totalPrice, setTotalPrice] = useState(null);

  async function loadData() {
    if (!editMode) return;

    const response = await api.get(`/plans/${id}`);

    const { data } = response;

    setPlan(data);
  }

  useEffect(() => {
    setTotalPrice(
      plan.duration > 0 && plan.price > 0
        ? formatPrice(plan.duration * plan.price)
        : ''
    );
  }, [editMode, plan.duration, plan.price]);

  /**
   * Fields with property "mask" were not working
   */
  function handleChange(event) {
    event.persist();
    setPlan(data => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(data) {
    try {
      if (editMode) {
        await api.put(`plans/${id}`, data);
      } else {
        await api.post('plans', data);
      }

      toast.success('Dados gravados com sucesso!');
      history.push('/list-plans');
    } catch (error) {
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
          {editMode ? 'Edição de plano' : 'Cadastro de plano'}
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
        initialData={plan}
        schema={schema}
        onSubmit={handleSubmit}
      >
        <Input
          name="title"
          label="TÍTULO DO PLANO"
          placeholder="Título do plano"
        />

        <div>
          <div>
            <Input
              type="text"
              mask="99"
              label="DURAÇÃO (em meses)"
              name="duration"
              value={plan.duration}
              onChange={handleChange}
              placeholder="Duração do plano"
            />
          </div>
          <div>
            <Input
              type="number"
              step="any"
              // type="text"
              // mask="R$ 0.00"   doesn't work :/
              label="PREÇO MENSAL"
              name="price"
              value={plan.price}
              onChange={handleChange}
              placeholder="Preço mensal do plano"
            />
          </div>
          <div>
            <Input
              disabled
              type="text"
              label="PREÇO TOTAL"
              name="totalPrice"
              value={totalPrice}
            />
          </div>
        </div>
      </Form>
    </Container>
  );
}

FormPlan.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

FormPlan.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
