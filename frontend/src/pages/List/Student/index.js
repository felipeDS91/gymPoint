import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Pagination from '~/components/Pagination';
import { Loading } from '~/styles/Loading';
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

let searchTimeout = null;

export default function ListStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  async function loadData(searchBy, pageNumber = 1) {
    setLoading(true);

    try {
      const { data } = await api.get('/students', {
        params: {
          page: pageNumber,
          q: searchBy,
        },
      });

      const { docs, ...info } = data;

      setStudents(docs);
      setPagination(info);
    } catch (error) {
      setStudents([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
      });
    }

    setLoading(false);
  }

  async function deleteStudent({ id, name }) {
    const confirm = window.confirm(`Deseja excluir o aluno ${name}?`);
    if (confirm) {
      try {
        await api.delete(`students/${id}`);
        await loadData();
        toast.success('Aluno excluído com sucesso!');
      } catch (error) {
        toast.error('Não foi possivel excluir o aluno!');
      }
    }
  }

  function handleSearch(e) {
    const { value } = e.target;
    setSearch(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      loadData(value);
    }, 600);
    searchTimeout = timeout;
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
        <TitlePage>Gerenciando alunos</TitlePage>
        <Options>
          <Link to="/student">
            <FiPlus size={20} color="#FFF" />
            CADASTRAR
          </Link>
          <SearchInput>
            <FiSearch size={16} color="#999" />
            <input
              type="text"
              placeholder="Buscar aluno"
              onChange={handleSearch}
              value={search}
            />
          </SearchInput>
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
                  <th width="350px">NOME</th>
                  <th width="250px">E-MAIL</th>
                  <th align="center" width="100px">
                    IDADE
                  </th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td align="center">{student.age}</td>
                      <td align="center">
                        <EditButton to={`/student/${student.id}`}>
                          editar
                        </EditButton>
                      </td>
                      <RemoveButton onClick={() => deleteStudent(student)}>
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
