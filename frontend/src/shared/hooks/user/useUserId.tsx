import { useEffect, useState } from "react";

export function useUserId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setUserId(user_id ?? "");
  }, []);

  return { userId };
}
