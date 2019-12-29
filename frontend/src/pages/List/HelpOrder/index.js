import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  SearchInput,
  TableContent,
  ReplyButton,
  StyledModal,
  Question,
} from './styles';

const schema = Yup.object().shape({
  answer: Yup.string().required('A resposta é obrigatória'),
});

export default function ListHelpOrders() {
  const [questions, setQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [questionModal, setQuestionModal] = useState({});

  function toggleModal(e) {
    setIsOpen(!isOpen);
  }

  async function loadData(search) {
    const response = await api.get('/help-orders', { params: { q: search } });
    const { data } = response;
    setQuestions(data);
  }

  async function loadQuestion(question) {
    setQuestionModal(question);
    setIsOpen(!isOpen);
  }

  async function handleSubmit(data) {
    try {
      await api.post(`help-orders/${questionModal.id}/answer`, data);

      loadData();
      toast.success('Pergunta respondida com sucesso!');
      toggleModal();
    } catch ({ response }) {
      toast.error(
        response.data.error || 'Não foi possivel responder a pergunta!'
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <StyledModal
        isOpen={isOpen}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
      >
        <span>PERGUNTA DO ALUNO</span>
        <Question>{questionModal.question}</Question>
        <Form
          id="form"
          // initialData={enrollment}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Input
            label="SUA RESPOSTA"
            multiline
            rows="4"
            name="answer"
            placeholder="Digite sua resposta aqui"
          />

          <button type="submit">Responder aluno</button>
        </Form>
      </StyledModal>

      <PageHeader>
        <TitlePage>Pedidos de auxílio</TitlePage>
        <Options>
          <SearchInput>
            <FiSearch size={16} color="#999" />
            <input
              type="text"
              placeholder="Buscar aluno"
              onChange={e => loadData(e.target.value)}
            />
          </SearchInput>
        </Options>
      </PageHeader>
      <TableContent>
        <table>
          <thead>
            <tr>
              <th width="600px">ALUNO</th>
              <th width="30px" />
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>{question.student.name}</td>
                <ReplyButton onClick={() => loadQuestion(question)}>
                  responder
                </ReplyButton>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContent>
    </Container>
  );
}
