import { socket } from "../socket";

export async function sendMessage(
  text: string,
  topic_id: number,
  user_id: number
) {
  try {
    socket.emit("send", {
      text: text,
      topic_id: topic_id,
      user_id: user_id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
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
