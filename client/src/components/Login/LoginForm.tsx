import { useState } from "react";
import {
  Form,
  FormField,
  Input,
  Label,
  SubmitButton,
  Title,
  Error,
  LoginContainer,
} from "./styles";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("Teste de erro");
    alert(`${email} + ${password}`);
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        {errorMessage && <Error>{errorMessage}</Error>}
        <FormField>
          <Label>Email:</Label>
          <Input
            type="email"
            placeholder="Primeiro acesso? use 'admin@prounion.com'"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormField>
        <FormField>
          <Label>Password:</Label>
          <Input
            type="password"
            placeholder="Primeiro acesso? use 'admin'"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormField>
        <SubmitButton type="submit">Login</SubmitButton>
      </Form>
    </LoginContainer>
  );
};

export default LoginForm;
