import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';
import { Container, FormInput, SendButtom } from './styles';
import api from '~/services/api';

export default function NewHelpOrder({ navigation }) {
  const [question, setQuestion] = useState('');
  const { id } = useSelector(state => state.user);

  async function handleSubmit() {
    try {
      await api.post(`/students/${id}/help-orders`, { question });
    } catch ({ response }) {
      showMessage({
        message: response.data.error || 'Não foi possivel enviar pedido!',
        type: 'danger',
      });
      return;
    }

    showMessage({
      message: 'Pedido de auxílio enviado com sucesso!',
      type: 'success',
    });

    navigation.navigate('HelpOrder');
  }

  return (
    <Container>
      <FormInput
        placeholder="Inclua seu pedido de auxílio"
        value={question}
        onChangeText={setQuestion}
      />

      <SendButtom onPress={handleSubmit}>Enviar pedido</SendButtom>
    </Container>
  );
}

NewHelpOrder.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
