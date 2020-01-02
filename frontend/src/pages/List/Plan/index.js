import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Pagination from '~/components/Pagination';
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

let searchTimeout = null;

export default function ListPlans() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  async function loadData(searchBy, pageNumber = 1) {
    setLoading(true);

    try {
      const { data } = await api.get('/plans', {
        params: {
          page: pageNumber,
          q: searchBy,
        },
      });

      const { docs, ...info } = data;

      const dataFormatted = docs.map(item => ({
        ...item,
        duration: `${item.duration} mês${item.duration > 1 ? 'es' : ''}`,
        price: formatPrice(item.price),
      }));

      setPlans(dataFormatted);
      setPagination(info);
    } catch (error) {
      setPlans([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
      });
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
