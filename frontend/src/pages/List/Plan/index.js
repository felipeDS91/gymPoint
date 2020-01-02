import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Loading } from '~/styles/Loading';
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
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  async function loadData(search) {
    setLoading(true);

    try {
      const response = await api.get('/plans', { params: { q: search } });

      const dataFormatted = response.data.map(item => ({
        ...item,
        duration: `${item.duration} mês${item.duration > 1 ? 'es' : ''}`,
        price: formatPrice(item.price),
      }));

      setPlans(dataFormatted);
    } catch (error) {
      setPlans([]);
    }

    setLoading(false);
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
        {loading ? (
          <center>
            <Loading color="#666" />
          </center>
        ) : (
          <table>
            <thead>
              <tr>
                <th width="350px">TÍTULO</th>
                <th width="250px">DURAÇÃO</th>
                <th width="200px">VALOR p/ MÊS</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map(plan => (
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
        )}
      </TableContent>
    </Container>
  );
}
