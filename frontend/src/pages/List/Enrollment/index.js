import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import { MdCheckCircle } from 'react-icons/md';

import Pagination from '~/components/Pagination';
import Search from '~/components/Search';
import { Loading } from '~/styles/Loading';
import api from '~/services/api';
import {
  Container,
  TitlePage,
  PageHeader,
  Options,
  TableContent,
  EditButton,
  RemoveButton,
} from './styles';

export default function ListEnrollment() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  async function loadData(searchBy, pageNumber = 1) {
    setLoading(true);

    try {
      const { data } = await api.get('/enrollments', {
        params: {
          page: pageNumber,
          q: searchBy,
        },
      });

      const { docs, ...info } = data;

      const dataFormatted = docs.map(item => ({
        ...item,
        start_date: format(parseISO(item.start_date), "d 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        end_date: format(parseISO(item.end_date), "d 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      }));

      setEnrollments(dataFormatted);
      setPagination(info);
    } catch (error) {
      setEnrollments([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
      });
    }

    setLoading(false);
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

  function handlePrev(page) {
    loadData(search, page);
  }

  function handleNext(page) {
    loadData(search, page);
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
          <Search
            loadData={loadData}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Options>
      </PageHeader>

      <TableContent>
        {loading ? (
          <center>
            <Loading color="#666" />
          </center>
        ) : (
          <>
            <table>
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
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map(enrollment => (
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
                      <RemoveButton
                        onClick={() => deleteEnrollment(enrollment)}
                      >
                        apagar
                      </RemoveButton>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" align="center">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          </>
        )}
      </TableContent>
    </Container>
  );
}
