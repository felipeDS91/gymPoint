import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px 20px 0 20px;
  background: #f2f2f2;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})``;

export const CheckInButton = styled(Button)`
  background: #ee4e62;
  margin-bottom: 10px;
  height: 45px;
`;

export const CheckInContent = styled.View`
  height: 46px;
  padding: 10px;
  justify-content: space-between;
  border: 1px solid #d6d7da;
  border-radius: 4px;
  flex-direction: row;
  background: #fff;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const CheckInId = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #444444;
`;

export const CheckInTime = styled.Text`
  font-size: 14px;
  color: #666666;
`;
