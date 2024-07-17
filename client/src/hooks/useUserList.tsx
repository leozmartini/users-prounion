import { useState } from "react";
import { User } from "../models/User";

const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  return { users, setUsers };
};

export default useUserList;
