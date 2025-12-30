import { useEffect, useState } from "react";

export function useUserId() {
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setUserId(Number(user_id) ?? 0);
  }, []);

  return { userId };
}
