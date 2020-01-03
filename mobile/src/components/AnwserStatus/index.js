import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { Container, Status } from './styles';

export default function AnwserStatus({ anwsered }) {
  const color = anwsered ? '#42cb59' : '#999999';
  return (
    <Container>
      <Icon name="check-circle" color={color} size={20} />
      <Status color={color}>{anwsered ? 'Respondido' : 'Sem Resposta'}</Status>
      <View />
    </Container>
  );
}

AnwserStatus.propTypes = {
  anwsered: PropTypes.bool,
};

AnwserStatus.defaultProps = {
  anwsered: false,
};
