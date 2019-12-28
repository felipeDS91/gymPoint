import React from 'react';

import logo from '~/assets/small-logo.png';
import { Container, Logo, LogoName } from './styles';

export default function LogoTitle(navigation) {
  return {
    headerTitle: props => (
      <Container>
        <Logo source={logo} />
        <LogoName>GYMPOINT</LogoName>
      </Container>
    ),
  };
}
