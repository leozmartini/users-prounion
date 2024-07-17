import React, { useState } from "react";
import { UserItemDiv, Title, Description, ButtonContainer } from "./styles";
import CustomButton from "../CustomButton/CustomButton";
import { toast, Toaster } from "sonner";
import { User } from "../../models/User";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

interface UserItemProps extends User {
  onUserDeleted: (id: number) => void;
  onUserUpdated: (d: number, email?: string, name?: string, password?: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({ id, name, email, onUserDeleted, onUserUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateModalOpen, setisUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      await onUserDeleted(id);
      toast.success("User deleted successfully");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      navigate("/login", { state: { message: "Sessão expirada. Faça login novamente." } });
    }
  };

  const onUpdate = async (input1Value?: string, input2Value?: string, input3Value?: string) => {
    try {
      if (!input1Value && !input2Value && !input3Value) {
        return toast.error("Insira ao menos um dado para atualizar.");
      }

      await onUserUpdated(id, input1Value, input2Value, input3Value);
      setisUpdateModalOpen(false);
      toast.success("Usuário atualizado.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      navigate("/login", { state: { message: "Sessão expirada. Faça login novamente." } });
    }
  };

  return (
    <>
      <UserItemDiv onClick={() => setIsOpen(!isOpen)}>
        <div>
          <Title>{email}</Title>
          {isOpen && <Description>{"Nome: " + name}</Description>}
          {isOpen && <Description>{"ID: " + id}</Description>}
          {isOpen && (
            <Description>
              {
                "Senha criptografada em Hash no banco de dados, por motivos de segurança, não será exibida no client."
              }
            </Description>
          )}
        </div>
        <ButtonContainer>
          <CustomButton onClick={() => setisUpdateModalOpen(true)} color="blue" icon="edit" />
          <CustomButton onClick={() => setisDeleteModalOpen(true)} color="red" icon="trash" />
        </ButtonContainer>
      </UserItemDiv>
      <Toaster richColors />
      {isUpdateModalOpen && (
        <Modal
          title="Atualizar usuário"
          description="Insira apenas os dados que deseja atualizar:"
          buttonText="Salvar"
          buttoncolor="blue"
          input1="Novo nome"
          input2="Novo Email"
          input3="Nova Senha"
          onClose={() => setisUpdateModalOpen(false)}
          onConfirm={onUpdate}
        />
      )}
      {isDeleteModalOpen && (
        <Modal
          title="Confirmação de deleção	"
          description={`Tem certeza que deseja excluír "${name}" ?`}
          buttonText="Deletar"
          buttoncolor="red"
          onClose={() => setisDeleteModalOpen(false)}
          onConfirm={onDelete}
        />
      )}
    </>
  );
};

export default UserItem;
