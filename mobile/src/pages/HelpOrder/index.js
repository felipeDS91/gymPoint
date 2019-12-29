import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import AnwserStatus from '~/components/AnwserStatus';

import {
  Container,
  NewHelpOrderButton,
  List,
  ListContent,
  ListHeader,
  DateLabel,
  Question,
} from './styles';
import api from '~/services/api';

function HelpOrder({ navigation, isFocused }) {
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

    // eslint-disable-next-line
  }, [isFocused]);

  return (
    <Container>
      <NewHelpOrderButton onPress={() => navigation.navigate('NewHelpOrder')}>
        Novo pedido de auxílio
      </NewHelpOrderButton>

      <List
        data={question}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ListContent
            onPress={() => navigation.navigate('Answer', { question: item })}
          >
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

export default withNavigationFocus(HelpOrder);
