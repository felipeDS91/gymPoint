import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import AnwserStatus from '~/components/AnwserStatus';

import {
  Container,
  NewHelpOrderButton,
  List,
  ListContent,
  ListHeader,
  Status,
  DateLabel,
  Question,
} from './styles';
import api from '~/services/api';

export default function HelpOrder() {
  const [question, setQuestions] = useState([]);
  const { id } = useSelector(state => state.user);

  async function loadCheckIns() {
    const response = await api.get(`/students/${id}/help-orders`);

    const dataFormatted = response.data.map(item => ({
      ...item,
      createdAt: formatRelative(parseISO(item.createdAt), new Date(), {
        locale: pt,
      }),
    }));

    setQuestions(dataFormatted);
  }

  useEffect(() => {
    loadCheckIns();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <NewHelpOrderButton>Novo pedido de auxílio</NewHelpOrderButton>

      <List
        data={question}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ListContent>
            <ListHeader>
              <AnwserStatus anwsered={item.answer_at} />
              <DateLabel>{item.createdAt}</DateLabel>
            </ListHeader>
            <Question>{item.question}</Question>
          </ListContent>
        )}
      />
    </Container>
  );
}
