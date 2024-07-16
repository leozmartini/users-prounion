import React, { useState } from "react";
import { UserItemDiv, Title, Description, ButtonContainer } from "./styles";
import CustomButton from "../CustomButton/CustomButton";

interface UserItemProps {
  id: string;
  name: string;
  email: string;
}

const UserItem: React.FC<UserItemProps> = ({ id, name, email }) => {
  const [isOpen, setIsOpen] = useState(false);

  // const name = "admin";
  // const email = "admin@prounion.com";
  // const password = "password";
  // const id = "id";

  return (
    <>
      <UserItemDiv onClick={() => setIsOpen(!isOpen)}>
        <div>
          <Title>{`${name}(${email})`}</Title>
          {isOpen && <Description>{"Password encrypted"}</Description>}
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
