import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { showMessage } from 'react-native-flash-message';
import api from '~/services/api';

import {
  Container,
  List,
  CheckInButton,
  CheckInContent,
  CheckInId,
  CheckInTime,
} from './styles';

export default function CheckIn() {
  const { id } = useSelector(state => state.user);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  async function loadCheckIns(pageNumber = 1) {
    setLoading(true);

    const response = await api.get(
      `/students/${id}/checkins?page=${pageNumber}`
    );

    const { docs, ...chekinInfo } = response.data;

    const dataFormatted = docs.map(item => ({
      id: item.id,
      createdAt: formatDistanceToNow(parseISO(item.createdAt), {
        locale: pt,
      }),
    }));

    setPagination(chekinInfo);
    setPage(pageNumber);
    setCheckins(
      pageNumber === 1 ? dataFormatted : [...checkins, ...dataFormatted]
    );
    setLoading(false);
  }

  useEffect(() => {
    loadCheckIns();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheckIn() {
    try {
      await api.post(`/students/${id}/checkins`);
    } catch ({ response }) {
      showMessage({
        message: response.data.error || 'Não foi possivel realizar check-in!',
        type: 'danger',
      });
      return;
    }

    showMessage({
      message: 'Check-in realizado com sucesso!',
      type: 'success',
    });

    loadCheckIns();
  }

  function loadMore() {
    if (page === pagination.pages) return;

    const pageNumber = page + 1;

    loadCheckIns(pageNumber);
  }

  return (
    <Container>
      <CheckInButton onPress={handleCheckIn}>Novo check-in</CheckInButton>
      <List
        data={checkins}
        onRefresh={() => loadCheckIns()}
        refreshing={loading}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <CheckInContent>
            <CheckInId>{`Check-in #${item.id}`}</CheckInId>
            <CheckInTime>{item.createdAt}</CheckInTime>
          </CheckInContent>
        )}
      />
    </Container>
  );
}
