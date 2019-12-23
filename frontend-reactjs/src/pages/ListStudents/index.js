import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';
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

export default function ListStudents() {
  const [students, setStudents] = useState([]);

  async function loadData(search) {
    const response = await api.get('/students', { params: { q: search } });

    const { data } = response;

    setStudents(data);
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <PageHeader>
        <TitlePage>Gerenciando alunos</TitlePage>
        <Options>
          <Link to="/form-student">
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
            <th width="350px">NOME</th>
            <th width="250px">E-MAIL</th>
            <th width="50px">IDADE</th>
            <th width="80px" />
            <th width="80px" />
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td align="center">{student.age}</td>
              <td align="center">
                <EditButton to={`/form-student/${student.id}`}>
                  editar
                </EditButton>
              </td>
              <RemoveButton onClick={() => deleteStudent(student)}>
                apagar
              </RemoveButton>
            </tr>
          ))}
        </tbody>
      </TableContent>
    </Container>
  );
}
