import { useState } from "react";
import { User } from "../models/User";
import { createUser, getAllUsers } from "../services/userApi";

const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleAddUser = async (input1Value: string, input2Value: string, input3Value: string) => {
    const newUser = {
      name: input1Value,
      email: input2Value,
      password: input3Value,
    };
    const response = await createUser(newUser.name, newUser.email, newUser.password);
    setUsers([...users, response]);
  };
  return { users, fetchUsers, handleAddUser };
};

export default useUserList;
