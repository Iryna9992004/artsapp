import io from "socket.io-client";

// Socket.IO тепер працює на тому ж порту, що і backend (4000)
// Використовуємо змінну оточення або дефолтний URL
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Створюємо socket з обробкою помилок підключення
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 5000,
});

// Обробка помилок підключення (щоб не засмічувати консоль)
socket.on("connect_error", (error) => {
  // Тихо обробляємо помилки підключення
  // Socket.IO автоматично спробує переподключитися
  console.debug("Socket.IO connection error:", error.message);
});

socket.on("connect", () => {
  console.debug("Socket.IO connected successfully");
});

socket.on("disconnect", (reason) => {
  console.debug("Socket.IO disconnected:", reason);
});
