import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { Form } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Input from '~/components/Input';
import history from '~/services/history';
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

export default function FormStudent({ match }) {
  const { id } = match.params;
  const [editMode] = useState(typeof id !== 'undefined');
  const [student, setStudent] = useState({
    name: '',
    email: '',
    age: '',
    weight: 0,
    height: 0,
  });

  async function loadData() {
    const response = await api.get(`/students/${id}`);

    const { data } = response;

    setStudent(data);
  }

  /**
   * Fields with property "mask" were not working
   */
  function handleChange(event) {
    event.persist();
    setStudent(data => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(data) {
    try {
      const clearData = {
        ...data,
        age: data.age,
        weight: data.weight.replace('kg', ''),
        height: data.height.replace('m', ''),
      };

      if (editMode) {
        await api.put(`students/${id}`, clearData);
      } else {
        await api.post('students', clearData);
      }

      toast.success('Dados gravados com sucesso!');
      history.push('/list-students');
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
          {editMode ? 'Edição de aluno' : 'Cadastro de aluno'}
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
        initialData={student}
        schema={schema}
        onSubmit={handleSubmit}
      >
        <Input name="name" label="NOME COMPLETO" placeholder="Nome complento" />
        <Input
          name="email"
          label="ENDEREÇO DE E-MAIL"
          type="email"
          placeholder="Seu email completo"
        />

        <div>
          <div>
            <Input
              type="text"
              mask="99"
              label="IDADE"
              name="age"
              value={student.age}
              onChange={handleChange}
              placeholder="Sua idade"
            />
          </div>
          <div>
            <Input
              type="text"
              mask="99.9kg"
              label="PESO(em kg)"
              name="weight"
              value={student.weight}
              onChange={handleChange}
              placeholder="Seu peso"
            />
          </div>
          <div>
            <Input
              type="text"
              mask="9.99m"
              label="ALTURA"
              name="height"
              value={student.height}
              onChange={handleChange}
              placeholder="Sua altura"
            />
          </div>
        </div>
      </Form>
    </Container>
  );
}

FormStudent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

FormStudent.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
