import { useEffect, useState } from "react";
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
import { login } from "../../services/authApi";
import { parseCookies, setCookie } from "nookies";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.token) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return setErrorMessage("Por favor, preencha todos os campos.");
    }
    const response = await login(email, password);
    if (!response.token) {
      return setErrorMessage(response);
    }
    setCookie(null, "token", response.token, {
      maxAge: 120,
      path: "/",
    });
    navigate("/home");
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
