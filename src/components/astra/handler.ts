import { readdirSync } from "fs";
import { Tsuki } from "../../client";
import {
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
} from "discord.js";
import root from "app-root-path";

export class BaseHandler {
  CommandData: Collection<string, SlashCommandBuilder> = new Collection();
  public client: Tsuki;

  constructor(client: Tsuki) {
    this.client = client;
  }

  async loadCommands() {
    const files = readdirSync(`${root}/dist/commands`);

    for (const file of files) {
      if (file.endsWith("js")) {
        const module = await import(`${root}/dist/commands/${file}`);
        const cmdClass = module.default;
        if (cmdClass) {
          this.client.commands.set(cmdClass.data.name, cmdClass);
          this.CommandData.set(cmdClass.data.name, cmdClass.data.toJSON());
          await this.sendCommands();
        }
      }
    }
    return this;
  }

  async sendCommands() {
    try {
      await this.client.application?.commands.set(
        this.CommandData.map((v) => v)
      );
      console.log("[Ares] -> Comandos registrados com sucesso.");
    } catch (e) {
      console.log(
        `[Ares] -> Os comandos não foram registrados, motivo: \n${e}`
      );
    }

    return this;
  }

  async runCommand(interaction: ChatInputCommandInteraction, client: Tsuki) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);

    if (!command) return;
    await command.setClient(client).setInteraction(interaction).execute();
  }
}
