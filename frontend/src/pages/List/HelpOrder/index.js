import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { Loading } from '~/styles/Loading';
import Pagination from '~/components/Pagination';
import Search from '~/components/Search';
import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  TableContent,
  ReplyButton,
  StyledModal,
  Question,
} from './styles';

const schema = Yup.object().shape({
  answer: Yup.string().required('A resposta é obrigatória'),
});

export default function ListHelpOrders() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [questionModal, setQuestionModal] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  async function loadData(searchBy, pageNumber = 1) {
    setLoading(true);

    try {
      const { data } = await api.get('/help-orders', {
        params: {
          page: pageNumber,
          q: searchBy,
        },
      });

      const { docs, ...info } = data;

      setQuestions(docs);
      setPagination(info);
    } catch (error) {
      setQuestions([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
      });
    }
    setLoading(false);
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

  function handlePrev(page) {
    loadData(search, page);
  }

  function handleNext(page) {
    loadData(search, page);
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
        <Form id="form" schema={schema} onSubmit={handleSubmit}>
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
          <Search
            loadData={loadData}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Options>
      </PageHeader>
      <TableContent>
        {loading ? (
          <center>
            <Loading color="#666" />
          </center>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th width="600px">ALUNO</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map(question => (
                    <tr key={question.id}>
                      <td>{question.student.name}</td>
                      <ReplyButton onClick={() => loadQuestion(question)}>
                        responder
                      </ReplyButton>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" align="center">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          </>
        )}
      </TableContent>
    </Container>
  );
}
