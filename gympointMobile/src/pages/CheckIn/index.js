import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { withNavigationFocus } from 'react-navigation';
import api from '~/services/api';

import {
  Container,
  List,
  CheckInButton,
  CheckInContent,
  CheckInId,
  CheckInTime,
} from './styles';

function CheckIn({ isFocused }) {
  const [checkins, setCheckins] = useState([]);
  const { id } = useSelector(state => state.user);

  async function loadCheckIns() {
    const response = await api.get(`/students/${id}/checkins`);

    const dataFormatted = response.data.map(item => ({
      id: item.id,
      createdAt: formatDistanceToNow(parseISO(item.createdAt), {
        locale: pt,
      }),
    }));

    setCheckins(dataFormatted);
  }

  useEffect(() => {
    if (isFocused) {
      loadCheckIns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  async function handleCheckIn() {
    // const response = await api.post(`/students/${id}/checkins`);
    await api.post(`/students/${id}/checkins`);

    loadCheckIns();
    // colocar um toast
  }

  return (
    <Container>
      <CheckInButton onPress={handleCheckIn}>Novo check-in</CheckInButton>
      <List
        data={checkins}
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

export default withNavigationFocus(CheckIn);
