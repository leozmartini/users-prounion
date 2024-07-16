import { useState } from "react";
import { User } from "../models/User";
import { getAllUsers } from "../services/userApi";

const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(`fetchTasks error: ${err.message}`);
    }
  };

  return { users, fetchUsers };
};

export default useUserList;
