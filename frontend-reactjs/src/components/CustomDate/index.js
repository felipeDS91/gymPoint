import React from 'react';
import ptBR from 'date-fns/locale/pt-BR';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDate = React.forwardRef((props, ref) => {
  registerLocale('ptBR', ptBR);
  setDefaultLocale('ptBR');
  return (
    <>
      <input
        readOnly
        placeholder={props.placeholder}
        className={props.className}
        onClick={props.onClick}
        value={props.value}
        onChange={props.onChange}
        type="text"
        name={props.name}
        ref={ref}
        onBlur={props.onBlur}
      />
    </>
  );
});

export default CustomDate;
