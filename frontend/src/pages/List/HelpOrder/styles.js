import styled from 'styled-components';
import { darken } from 'polished';
import Modal from 'styled-react-modal';

export const Container = styled.div`
  max-width: 700px;
  margin: 50px auto;
`;

export const Columns = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  > div {
    display: flex;
    flex-direction: column;
    width: 33.33%;

    & + div {
      margin-left: 12px;
    }
  }
`;

export const StyledModal = Modal.styled`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 450px;
  height: 425px;
  padding: 30px;
  background-color: #FFFFFF;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0 10px;

  form {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    margin-top: auto;

    textarea {
      border: 1px solid #d6d7da;
      border-radius: 4px;
      padding: 14px;

      &::placeholder {
        color: #c4c4c4;
      }
    }

    span {
      color: #f66f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

  }

  label {
    font-size: 14px;
    color: #444444;
    text-align: left;
    margin-bottom: 4px;
    font-weight: bold;
    margin-top: 12px;
    display: block;
  }

  span {
    font-size: 14px;
    color: #444444;
    text-align: left;
    margin-bottom: 4px;
    font-weight: bold;
    margin-top: 12px !important;
  }

  button {
    border: 0;
    height: 36px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background: #ee4d64;
    margin-top: 20px;

    &:hover {
      background: ${darken(0.08, '#ee4d64')};
    }
  }

`;

export const Question = styled.div`
  font-size: 16px;
  color: #666666;
  line-height: 26px;
  text-align: left;
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
  margin-bottom: 20px;
`;

export const TitlePage = styled.strong`
  color: #444;
  font-size: 24px;
`;

export const ReplyButton = styled.td`
  width: 80px;
  border: 0;
  background: transparent;
  color: #4d85ee;
  text-align: right;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: ${darken(0.08, '#4d85ee')};
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
