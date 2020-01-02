import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
`;

export const Options = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 25px 0 25px 25px;
    height: 36px;
    width: 142px;
    background: #ee4d64;
    color: #fff;
    border: 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    transition: backgroud 0.2s;
    border: 20px;
    padding: 0 10px 0 10px;

    &:hover {
      background: ${darken(0.03, '#EE4D64')};
    }
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitlePage = styled.strong`
  color: #444;
  font-size: 24px;
`;

export const EditButton = styled(Link)`
  width: 80px;
  color: #4d85ee;
  text-align: right;
  font-size: 15px;

  &:hover {
    color: ${darken(0.08, '#4d85ee')};
  }
`;

export const RemoveButton = styled.td`
  width: 80px;
  border: 0;
  background: transparent;
  color: #de3b3b;
  text-align: right;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    color: ${darken(0.08, '#de3b3b')};
  }
`;

export const TableContent = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 25px;

  thead {
    font-size: 16px;
    color: #444;
    text-align: left;
  }

  tbody {
    color: #666;
    font-size: 16px;
    line-height: 20px;

    tr {
      & + tr {
        td {
          border-top: 1px solid #eeeeee;
        }
      }
    }

    td {
      padding: 20px 0 20px 0;
    }
  }
`;
