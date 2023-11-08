import { Interaction } from "discord.js";
import { Tsuki } from "../../client";
import { BaseHandler } from "./handler";

export class ClientInteraction extends Tsuki {
  public interaction: Interaction;
  public handler: BaseHandler;

  constructor(options: { interaction: Interaction; handler: BaseHandler }) {
    super();
    this.interaction = options.interaction;
    this.handler = options.handler;
  }

  async run() {
    if (this.interaction.isChatInputCommand()) {
      await this.handler.runCommand(this.interaction, this);
      this.user?.setStatus("idle");
    }
  }
}

export class Inicializar {
  public client: Tsuki;
  constructor(options: { client: Tsuki }) {
    this.client = options.client;
  }
  run() {
    console.log("[Ares] -> Client pronto.");
    this.client.user?.setStatus("idle");
  }
}
