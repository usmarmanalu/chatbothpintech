import fs from "fs";
import path from "path";

const filePath = path.resolve("./data/m,emory.json");

export function getHistory(userId) {


    const dataa = JSON.parse(fs.readFileSync(filePath));
    if(!dataa[userId]){
        return[]
    }

    return dataa[userId];
}

export function saveMessage(userId, role, message) {

  const data = JSON.parse(fs.readFileSync(filePath));

  if (!data[userId]) {
    data[userId] = [];
  }

  data[userId].push({
    role,
    content: message
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

