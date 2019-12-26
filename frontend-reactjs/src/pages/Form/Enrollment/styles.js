import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    padding: 10px 22px 22px 22px;
    background: #ffffff;
    border-radius: 4px;
    margin-top: 20px;

    label {
      font-size: 14px;
      color: #444444;
      text-align: left;
      margin-bottom: 4px;
      font-weight: bold;
      margin-top: 12px !important;
    }

    input {
      border: 1px solid #d6d7da;
      border-radius: 4px;
      height: 36px;
      padding: 14px;
    }

    /* select {
      border: 1px solid #d6d7da;
      border-radius: 4px;
      height: 36px;
      padding: 8px;
      background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position-x: 100%;
      -webkit-appearance: none;
      background-position-y: 5px;
      font-size: 14px;
      cursor: pointer;

      option {
        color: #757575;
        border: 0;
        border-radius: 4px;
      }
    } */

    span {
      color: #f66f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }
  }
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

export const Options = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  height: 36px;
  width: 110px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #ee4d64;
  text-align: right;

  svg {
    margin: 0 10px 0 10px;
  }

  &:hover {
    background: ${darken(0.08, '#ee4d64')};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  height: 36px;
  width: 110px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #cccccc;
  text-align: right;
  margin-right: 14px;

  svg {
    margin: 0 10px 0 10px;
  }

  &:hover {
    background: ${darken(0.08, '#cccccc')};
  }
`;
