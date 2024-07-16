import styled from "styled-components";

export const UserItemDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #eaeaea;
  }
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.1em;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

export const Description = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  max-height: 200px;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  align-self: flex-start;
`;
