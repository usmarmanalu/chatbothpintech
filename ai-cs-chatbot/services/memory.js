const memory = {};

export function getMemory(userId) {

  if (!memory[userId]) {
    memory[userId] = [];
  }

  return memory[userId];

}

export function saveMemory(userId, message, reply) {

  if (!memory[userId]) {
    memory[userId] = [];
  }

  memory[userId].push({
    role: "user",
    content: message
  });

  memory[userId].push({
    role: "assistant",
    content: reply
  });

  if (memory[userId].length > 20) {
    memory[userId] = memory[userId].slice(-20);
  }

}