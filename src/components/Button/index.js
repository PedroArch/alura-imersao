import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin: 10px 0;
  color: white;

  :disabled {
    background-color: gray;
  }
`;

export default Button;
