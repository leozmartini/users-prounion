import React, { useEffect, useState } from "react";
import UserItem from "../UserItem/UserItem";
import { Table, ButtonContainer, UserList, StyledH2 } from "./styles";
import CustomButton from "../CustomButton/CustomButton";
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { toast, Toaster } from "sonner";
import { createUser, getAllUsers } from "../../services/userApi";
import useUserList from "../../hooks/useUserList";

const UserTable: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { users, setUsers } = useUserList();

  const navigate = useNavigate();
  const cookies = parseCookies();

  useEffect(() => {
    (async () => {
      if (cookies.token) {
        try {
          const fetchedUsers = await getAllUsers();
          setUsers(fetchedUsers);
        } catch (error) {
          destroyCookie(null, "token");
          navigate("/login", { state: { message: "Sessão expirada. Faça login novamente." } });
          return;
        }
      } else {
        navigate("/login", { state: { message: "Sessão não encontrada. Faça login novamente." } });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.token]);

  const onAddUser = async (input1Value?: string, input2Value?: string, input3Value?: string) => {
    if (input1Value && input2Value && input3Value) {
      try {
        const newUser = await createUser(input1Value, input2Value, input3Value);
        setUsers([...users, newUser]);
        setIsAddModalOpen(false);
        toast.success("Usuário cadastrado.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const onUserDeleted = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const onUserUpdated = async (id: number, response: object) => {
    // Atualizar o usuário correspondente no array de usuários
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, ...response };
      }
      return user;
    });

    setUsers(updatedUsers);
  };

  return (
    <>
      <Table>
        <ButtonContainer>
          <StyledH2>Usuários registrados</StyledH2>
          <CustomButton onClick={() => setIsAddModalOpen(true)} icon="plus" color="green" />
        </ButtonContainer>
        <UserList>
          {users.map(user => (
            <UserItem
              id={user.id}
              name={user.name}
              email={user.email}
              onUserDeleted={onUserDeleted}
              onUserUpdated={onUserUpdated}
              key={user.id}
            />
          ))}
        </UserList>
      </Table>
      {isAddModalOpen && (
        <Modal
          title="Cadastrar novo usuário"
          description="Insira os dados abaixo:"
          buttonText="Cadastrar"
          buttoncolor="green"
          input1="Nome"
          input2="Email"
          input3="Senha"
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={onAddUser}
        />
      )}
      <Toaster richColors />
    </>
  );
};

export default UserTable;
