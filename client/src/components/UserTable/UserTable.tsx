import React from "react";
import UserItem from "../UserItem/UserItem";
import { Table, ButtonContainer, UserList, StyledH2 } from "./styles";
import CustomButton from "../CustomButton/CustomButton";

const TaskTable: React.FC = () => {
  const tasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Task 1 description",
    },
  ];

  return (
    <>
      <Table>
        <ButtonContainer>
          <StyledH2>Usuários registrados</StyledH2>
          <CustomButton onClick={() => alert("add")} icon="plus" color="green" />
        </ButtonContainer>
        <UserList>
          {tasks.map(task => (
            <UserItem key={task.id} />
          ))}
        </UserList>
      </Table>
    </>
  );
};

export default TaskTable;
