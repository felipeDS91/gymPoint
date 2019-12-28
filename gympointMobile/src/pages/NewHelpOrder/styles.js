import styled from 'styled-components/native';

import Input from '~/components/Input';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  background: #f2f2f2;
`;

export const FormInput = styled(Input).attrs({
  textAlignVertical: 'top',
  multiline: true,
  numberOfLines: 20,
})`
  height: 300px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #d6d7da;
  border-radius: 4px;
  padding: 15px;
`;

export const SendButtom = styled(Button)`
  background: #ee4e62;
  margin-top: 20px;
  height: 45px;
`;
