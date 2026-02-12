import { socket } from "../socket";

export async function sendMessage(
  text: string,
  topic_id: number,
  user_id: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Перевіряємо, чи socket підключений
    if (!socket.connected) {
      reject(new Error("Socket is not connected. Please wait for connection."));
      return;
    }

    try {
      socket.emit("send", {
        text: text,
        topic_id: topic_id,
        user_id: user_id,
      }, (response?: { error?: string; success?: boolean }) => {
        // Якщо є callback з відповіддю
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
      
      // Якщо callback не викликається протягом 5 секунд, вважаємо успішним
      // (оскільки socket.emit не завжди повертає callback)
      setTimeout(() => {
        resolve();
      }, 5000);
    } catch (e) {
      console.error("Error sending message:", e);
      reject(e);
    }
  });
}

export async function readMessage(message_id: number, user_id: number) {
  try {
    socket.emit("read", {
      user_id,
      message_id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
