import React, { useEffect, useState } from "react";
import UserItem from "../UserItem/UserItem";
import { Table, ButtonContainer, UserList, StyledH2 } from "./styles";
import CustomButton from "../CustomButton/CustomButton";
import useUserList from "../../hooks/useUserList";
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { toast, Toaster } from "sonner";

const UserTable: React.FC = () => {
  const { users, fetchUsers, handleAddUser } = useUserList();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigate = useNavigate();
  const cookies = parseCookies();

  useEffect(() => {
    (async () => {
      if (cookies.token) {
        try {
          await fetchUsers();
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
  }, [cookies.token, navigate]);

  const onAddUser = async (input1Value?: string, input2Value?: string, input3Value?: string) => {
    if (input1Value && input2Value && input3Value) {
      try {
        await handleAddUser(input1Value, input2Value, input3Value);
        setIsAddModalOpen(false);
        toast.success("Usuário cadastrado.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
      }
    }
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
            <UserItem id={user.id} name={user.name} email={user.email} key={user.id} />
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
