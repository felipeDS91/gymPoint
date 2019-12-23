import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosCheckmark } from 'react-icons/io';
import { Form } from '@rocketseat/unform';
import * as Yup from 'yup';
import Input from '~/components/Input';

import api from '../../services/api';
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

export default function FormStudent({ history }) {
  function handleNewRegister() {}

  const [student, setStudent] = useState({});

  async function loadData(id) {
    const response = await api.get(`/students/${id}`);

    const { data } = response;

    setStudent(data);
  }

  async function handleSubmit(data) {
    console.log(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <PageHeader>
        <TitlePage>Edição de aluno</TitlePage>
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
              placeholder="Sua idade"
            />
          </div>
          <div>
            <Input
              type="text"
              mask="99.9kg"
              label="PESO(em kg)"
              name="weight"
              placeholder="Seu peso"
            />
          </div>
          <div>
            <Input
              type="text"
              mask="9.99m"
              label="ALTURA"
              name="height"
              placeholder="Sua altura"
            />
          </div>
        </div>
      </Form>
    </Container>
  );
}
