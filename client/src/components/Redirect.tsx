import { useNavigate } from "react-router-dom";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const Redirect = () => {
  const navigate = useNavigate();

  const cookies = parseCookies();
  console.log(cookies.token);
  useEffect(() => {
    navigate(cookies.token ? "/home" : "/login");
  }, [cookies.token, navigate]);
};

export default Redirect;
