import React, { useState } from "react";
import { UserItemDiv, Title, Description, ButtonContainer } from "./styles";
import CustomButton from "../CustomButton/CustomButton";

const TaskItem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const title = "Task title";
  const description = "Task description";

  return (
    <>
      <UserItemDiv onClick={() => setIsOpen(!isOpen)}>
        <div>
          <Title>{title}</Title>
          {isOpen && <Description>{description}</Description>}
        </div>
        <ButtonContainer>
          <CustomButton onClick={() => alert("edit")} color="blue" icon="edit" />
          <CustomButton onClick={() => alert("delete")} color="red" icon="trash" />
        </ButtonContainer>
      </UserItemDiv>
    </>
  );
};

export default TaskItem;
