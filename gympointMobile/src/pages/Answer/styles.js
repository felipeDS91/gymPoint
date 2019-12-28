import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px 20px 0 20px;
  background: #f2f2f2;
`;

export const Card = styled.View`
  padding: 20px;
  justify-content: space-between;
  border: 1px solid #d6d7da;
  border-radius: 4px;
  background: #fff;
  align-items: center;
  margin-top: 10px;
`;

export const ContentHeader = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  background: #fff;
  margin-bottom: 10px;
`;

export const Title = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #444444;
`;

export const DateLabel = styled.Text`
  font-size: 14px;
  color: #666666;
`;

export const Content = styled.Text`
  font-size: 14px;
  text-align: left;
  align-self: flex-start;
  color: #666666;
  line-height: 26px;
  margin-bottom: 10px;
`;
