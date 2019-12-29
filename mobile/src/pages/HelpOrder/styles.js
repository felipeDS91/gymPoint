import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px 20px 0 20px;
  background: #f2f2f2;
`;

export const NewHelpOrderButton = styled(Button)`
  background: #ee4e62;
  margin-bottom: 10px;
  height: 45px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})``;

export const ListContent = styled.TouchableOpacity`
  height: 150px;
  padding: 15px;
  border: 1px solid #d6d7da;
  border-radius: 4px;
  background: #fff;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const ListHeader = styled.View`
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const DateLabel = styled.Text`
  font-size: 14px;
  color: #666666;
`;

export const Question = styled.Text.attrs({
  numberOfLines: 3,
})`
  font-size: 14px;
  text-align: left;
  align-self: flex-start;
  color: #666666;
  line-height: 26px;
`;
