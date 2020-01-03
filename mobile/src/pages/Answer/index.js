import React, { useMemo } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import pt from 'date-fns/locale/pt';
import {
  Container,
  ContentHeader,
  Title,
  DateLabel,
  Content,
  Card,
} from './styles';

export default function Answer({ navigation }) {
  const question = navigation.getParam('question');

  const dateParsed = useMemo(() => {
    if (question.answer_at)
      return formatRelative(parseISO(question.answer_at), new Date(), {
        locale: pt,
      });
    return '';
  }, [question.answer_at]);

  return (
    <Container>
      <Card>
        <ContentHeader>
          <Title>PERGUNTA</Title>
          <DateLabel>{question.createdAt}</DateLabel>
        </ContentHeader>
        <Content>{question.question}</Content>
        <ContentHeader>
          <Title>RESPOSTA</Title>
          <DateLabel>{dateParsed}</DateLabel>
        </ContentHeader>
        <Content>{question.answer}</Content>
      </Card>
    </Container>
  );
}

Answer.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
