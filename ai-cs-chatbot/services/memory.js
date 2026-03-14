const memoryStore = {};

export function getMemory(userId) {

  if (!memoryStore[userId]) {
    memoryStore[userId] = [];
  }

  return memoryStore[userId];

}

export function saveMemory(userId, message, reply) {

  if (!memoryStore[userId]) {
    memoryStore[userId] = [];
  }

  memoryStore[userId].push({
    role: "user",
    content: message
  });

  memoryStore[userId].push({
    role: "assistant",
    content: reply
  });

  // batasi memory max 10 chat
  if (memoryStore[userId].length > 20) {
    memoryStore[userId] = memoryStore[userId].slice(-20);
  }
}