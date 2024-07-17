import React from "react";
import Header from "../components/Header/Header";
import UserTable from "../components/UserTable/UserTable";
import Modal from "../components/Modal/Modal";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  return (
    <>
      <Header />
      <UserTable />

      {isModalOpen && (
        <Modal
          title="Boas vindas"
          buttonText="Ok"
          buttoncolor="green"
          description={
            <>
              Olá! <br />
              Aqui você pode gerenciar os usuários. <br />
              Para ter acesso à essa página, você pode logar com qualquer um dos usuários que
              estiverem listados. <br />
              Fique a vontade de criar, editar e deletar usuários. <br />
              Recomendamos que você troque a senha de seu usuário após o primeiro login 😉.
            </>
          }
          onConfirm={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default App;
