import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Tsuki } from "./client";

export interface Command {
  data: SlashCommandBuilder;
  client: Tsuki | null;
  interaction: ChatInputCommandInteraction | null;

  setClient(client: Tsuki): this;
  setInteraction(interaction: ChatInputCommandInteraction): this;
  execute(): Promise<void>;
}
