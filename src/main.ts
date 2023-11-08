import { Tsuki } from "./client";
import { Inicializar, ClientInteraction } from "./components/astra/events";
import { BaseHandler } from "./components/astra/handler";

export class Main extends Tsuki {
  public eventHandler: EventHandler;
  public inicializar: Inicializar;

  constructor() {
    super();
    this.inicializar = new Inicializar({ client: this });
    this.eventHandler = new EventHandler(this.inicializar, this);
  }

  async main() {
    this.login();
    this.mongoConnect();
    this.eventHandler.ready().interaction();
  }
}

export class EventHandler {
  private inicializar: Inicializar;
  private client: Tsuki;
  private handler: BaseHandler;

  constructor(inicializar: Inicializar, client: Tsuki) {
    this.client = client;
    this.inicializar = inicializar;
    this.handler = new BaseHandler(this.client);
  }

  ready() {
    this.client.once("ready", () => {
      this.inicializar.run();
      this.handler.loadCommands();
    });

    return this;
  }

  interaction() {
    this.client.on("interactionCreate", (i) => {
      new ClientInteraction({
        interaction: i,
        handler: this.handler,
      }).run();
    });
    return this;
  }
}

new Main().main();
