import styled from "styled-components";

export const Button = styled.button<{ buttoncolor?: string }>`
  background-color: ${({ buttoncolor }) => buttoncolor || "black"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
`;
