import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { formatRelative, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
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
  const { id } = useSelector(state => state.user);
  const [question, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  async function loadHelOrders(pageNumber = 1) {
    setLoading(true);

    const response = await api.get(
      `/students/${id}/help-orders?page=${pageNumber}`
    );

    const { docs, ...questionInfo } = response.data;

    const dataFormatted = docs.map(item => ({
      ...item,
      createdAt: formatRelative(parseISO(item.createdAt), new Date(), {
        locale: pt,
      }),
    }));

    setPagination(questionInfo);
    setPage(pageNumber);
    setQuestions(
      pageNumber === 1 ? dataFormatted : [...question, ...dataFormatted]
    );
    setLoading(false);
  }

  useEffect(() => {
    loadHelOrders();

    // eslint-disable-next-line
  }, [isFocused]);

  function loadMore() {
    if (page === pagination.pages) return;

    const pageNumber = page + 1;

    loadHelOrders(pageNumber);
  }

  return (
    <Container>
      <NewHelpOrderButton onPress={() => navigation.navigate('NewHelpOrder')}>
        Novo pedido de auxílio
      </NewHelpOrderButton>

      <List
        data={question}
        onRefresh={() => loadHelOrders()}
        refreshing={loading}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
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

HelpOrder.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  isFocused: PropTypes.bool,
};

HelpOrder.defaultProps = {
  isFocused: false,
};

export default withNavigationFocus(HelpOrder);
