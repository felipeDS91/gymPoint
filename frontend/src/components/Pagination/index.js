import React from 'react';
import propTypes from 'prop-types';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';

import { Button, PaginationContainer } from './styles';

export default function Pagination({
  page,
  pages,
  total,
  handlePrev,
  handleNext,
}) {
  return (
    <PaginationContainer>
      <Button
        disabled={!(page > 1 && total)}
        onClick={() => handlePrev(page - 1)}
      >
        <MdKeyboardArrowLeft size="20" />
        Anterior
      </Button>

      <span>{pages > 0 && `Página ${page} de ${pages}`}</span>

      <Button
        disabled={!(page < pages && total)}
        onClick={() => handleNext(page + 1)}
      >
        Próxima
        <MdKeyboardArrowRight size="20" />
      </Button>
    </PaginationContainer>
  );
}

Pagination.propTypes = {
  page: propTypes.number.isRequired,
  pages: propTypes.number.isRequired,
  total: propTypes.number.isRequired,
  handlePrev: propTypes.func,
  handleNext: propTypes.func,
};

Pagination.defaultProps = {
  handlePrev: () => {},
  handleNext: () => {},
};
