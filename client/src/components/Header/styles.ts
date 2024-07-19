import styled from "styled-components";

export const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #242424;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .left-image img {
    width: 5rem;
    height: auto;
    margin-right: 10px;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 0.3rem;
    color: white;
    max-width: 50%;
  }

  .right-image img {
    width: 2rem;
    border-radius: 50%;
  }

  @media (min-width: 768px) {
    .left-image img {
      width: 10rem;
    }

    .title {
      font-size: 1rem;
    }

    .right-image img {
      width: 3rem;
    }
  }
`;
