import React, { useEffect } from "react";
import UserItem from "../UserItem/UserItem";
import { Table, ButtonContainer, UserList, StyledH2 } from "./styles";
import CustomButton from "../CustomButton/CustomButton";
import useUserList from "../../hooks/useUserList";
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";

const UserTable: React.FC = () => {
  const { users, fetchUsers } = useUserList();
  const navigate = useNavigate();
  const cookies = parseCookies();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        destroyCookie(null, "token");
        navigate("/login");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  return (
    <>
      <Table>
        <ButtonContainer>
          <StyledH2>Usuários registrados</StyledH2>
          <CustomButton onClick={() => alert("add")} icon="plus" color="green" />
        </ButtonContainer>
        <UserList>
          {users.map(user => (
            <UserItem id={user.id} name={user.name} email={user.email} key={user.id} />
          ))}
        </UserList>
      </Table>
    </>
  );
};

export default UserTable;
