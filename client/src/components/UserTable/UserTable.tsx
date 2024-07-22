import React, { useEffect, useState } from "react";
import UserItem from "../UserItem/UserItem";
import { Table, ButtonContainer, UserList } from "./styles";
import CustomButton from "../CustomButton/CustomButton";
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { toast, Toaster } from "sonner";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/userApi";
import useUserList from "../../hooks/useUserList";

const UserTable: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { users, setUsers } = useUserList();

  const navigate = useNavigate();
  const cookies = parseCookies();

  useEffect(() => {
    (async () => {
      // Verifica se o usuário tem um token. Se não tiver redireciona para a página de login
      // A página que pode ser renderizada não possui dados sensíveis.
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

  const onUserDeleted = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const onUserUpdated = async (id: number, email?: string, name?: string, password?: string) => {
    try {
      const response = await updateUser(id, email, name, password);

      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, ...response };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsAddModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      throw new Error("expeted error");
    }
  };

  const onLogout = () => {
    destroyCookie(null, "token");
    navigate("/login", { state: { message: "Sua sessão foi encerrada." } });
  };

  return (
    <>
      <Table>
        <ButtonContainer>
          <CustomButton onClick={onLogout} text="LogOut" color="red" />
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
