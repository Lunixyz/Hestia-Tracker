import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection } from "discord.js";
import { connect, set } from "mongoose";
import { Command } from "./command";

export class Tsuki extends Client {
  commands: Collection<string, Command> = new Collection();
  constructor() {
    super({ intents: 3276799 });
  }

  login() {
    return super.login(process.env.TOKEN);
  }
  async mongoConnect() {
    set("strictQuery", true);
    await connect(process.env.MONGO_URI ?? "");
    return console.log("[Tsuki] -> Conexão com Mongoose iniciada.");
  }
}
