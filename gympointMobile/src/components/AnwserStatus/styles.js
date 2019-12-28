import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const Status = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.color};
  margin-left: 6px;
`;
