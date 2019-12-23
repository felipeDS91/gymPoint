import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { formatPrice } from '~/util/format';
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

export default function ListPlans() {
  const [plans, setPlans] = useState([]);

  async function loadData(search) {
    const response = await api.get('/plans', { params: { q: search } });

    const { data } = response;

    const dataFormatted = data.map(item => ({
      ...item,
      duration: `${item.duration} mês${item.duration > 1 ? 'es' : ''}`,
      price: formatPrice(item.price),
    }));

    setPlans(dataFormatted);
  }

  async function deletePlan({ id, title }) {
    const confirm = window.confirm(`Deseja excluir o plano ${title}?`);
    if (confirm) {
      try {
        await api.delete(`plans/${id}`);
        await loadData();
        toast.success('Plano excluído com sucesso!');
      } catch (error) {
        toast.error('Não foi possivel excluir o plano!');
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <PageHeader>
        <TitlePage>Gerenciando planos</TitlePage>
        <Options>
          <Link to="/plan">
            <FiPlus size={20} color="#FFF" />
            CADASTRAR
          </Link>
          <SearchInput>
            <FiSearch size={16} color="#999" />
            <input
              type="text"
              placeholder="Buscar plano"
              onChange={e => loadData(e.target.value)}
            />
          </SearchInput>
        </Options>
      </PageHeader>

      <TableContent>
        <thead>
          <tr>
            <th width="350px">TÍTULO</th>
            <th width="250px">DURAÇÃO</th>
            <th width="200px">VALOR p/ MÊS</th>
            <th width="80px" />
            <th width="80px" />
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.title}</td>
              <td>{plan.duration}</td>
              <td align="center">{plan.price}</td>
              <td align="center">
                <EditButton to={`/plan/${plan.id}`}>editar</EditButton>
              </td>
              <RemoveButton onClick={() => deletePlan(plan)}>
                apagar
              </RemoveButton>
            </tr>
          ))}
        </tbody>
      </TableContent>
    </Container>
  );
}
