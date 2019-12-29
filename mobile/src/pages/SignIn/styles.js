import { Platform } from 'react-native';
import styled from 'styled-components/native';

import Input from '~/components/Input';
import Button from '~/components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  background-color: #fff;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 50px;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
  background: transparent;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export const LogoName = styled.Text`
  color: #ee4e62;
  font-weight: bold;
  font-size: 23px;
  align-self: center;
  margin-bottom: 20px;
`;

export const SubmitButton = styled(Button)`
  background: #ee4e62;
  margin-top: 5px;
`;
