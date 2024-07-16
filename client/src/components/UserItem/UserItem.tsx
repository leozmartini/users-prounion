import React, { useState } from "react";
import { UserItemDiv, Title, Description, ButtonContainer } from "./styles";
import CustomButton from "../CustomButton/CustomButton";

const UserItem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const name = "admin";
  const email = "admin@prounion.com";
  const password = "password";
  const id = "id";

  return (
    <>
      <UserItemDiv onClick={() => setIsOpen(!isOpen)}>
        <div>
          <Title>{`${name}(${email})`}</Title>
          {isOpen && <Description>{password}</Description>}
          {isOpen && <Description>{id}</Description>}
        </div>
        <ButtonContainer>
          <CustomButton onClick={() => alert("edit")} color="blue" icon="edit" />
          <CustomButton onClick={() => alert("delete")} color="red" icon="trash" />
        </ButtonContainer>
      </UserItemDiv>
    </>
  );
};

export default UserItem;
