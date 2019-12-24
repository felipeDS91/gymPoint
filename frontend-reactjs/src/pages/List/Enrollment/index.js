import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import { MdCheckCircle } from 'react-icons/md';

import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  SearchInput,
  TableContent,
  EditButton,
  RemoveButton,
} from './styles';

export default function ListEnrollment() {
  const [enrollments, setEnrollments] = useState([]);

  async function loadData(search) {
    const response = await api.get('/enrollments', { params: { q: search } });

    const { data } = response;

    const dataFormatted = data.map(item => ({
      ...item,
      start_date: format(parseISO(item.start_date), "d 'de' MMMM 'de' yyyy", {
        locale: pt,
      }),
      end_date: format(parseISO(item.end_date), "d 'de' MMMM 'de' yyyy", {
        locale: pt,
      }),
    }));

    setEnrollments(dataFormatted);
  }

  async function deleteEnrollment({ id, student }) {
    const confirm = window.confirm(
      `Deseja excluir a matrícula de ${student.name}?`
    );
    if (confirm) {
      try {
        await api.delete(`enrollments/${id}`);
        await loadData();
        toast.success('Matrícula excluída com sucesso!');
      } catch (error) {
        toast.error('Não foi possivel excluir a matrícula!');
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <PageHeader>
        <TitlePage>Gerenciando matrículas</TitlePage>
        <Options>
          <Link to="/enrollment">
            <FiPlus size={20} color="#FFF" />
            CADASTRAR
          </Link>
          <SearchInput>
            <FiSearch size={16} color="#999" />
            <input
              type="text"
              placeholder="Buscar aluno"
              onChange={e => loadData(e.target.value)}
            />
          </SearchInput>
        </Options>
      </PageHeader>

      <TableContent>
        <thead>
          <tr>
            <th width="380px">ALUNO</th>
            <th width="210px">PLANO</th>
            <th width="250px" align="center">
              INÍCIO
            </th>
            <th width="250px" align="center">
              TÉRMINO
            </th>
            <th width="100px" align="center">
              ATIVA
            </th>
            <th width="20px" />
            <th width="20px" />
          </tr>
        </thead>
        <tbody>
          {enrollments.map(enrollment => (
            <tr key={enrollment.id}>
              <td>{enrollment.student.name}</td>
              <td>{enrollment.plan.title}</td>
              <td align="center">{enrollment.start_date}</td>
              <td align="center">{enrollment.end_date}</td>
              <td align="center">
                <MdCheckCircle
                  size={16}
                  color={enrollment.active ? '#42cb59' : '#dddddd'}
                />
              </td>
              <td align="center">
                <EditButton to={`/enrollment/${enrollment.id}`}>
                  editar
                </EditButton>
              </td>
              <RemoveButton onClick={() => deleteEnrollment(enrollment)}>
                apagar
              </RemoveButton>
            </tr>
          ))}
        </tbody>
      </TableContent>
    </Container>
  );
}
