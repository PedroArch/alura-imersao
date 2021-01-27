import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.mainBg};
  border: 2px solid gray;
  border-radius: 5px;
  margin: 10px 0;
  color: #fff;
  padding: 10px;
`;

export default Input;
