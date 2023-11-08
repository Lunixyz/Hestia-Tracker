import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../command";
import axios, { AxiosResponse } from "axios";
import { BEmbed } from "../components/discord/Embed";
import { Tsuki } from "../client";
import { Cache } from "../components/astra/Cache";

class AppInfo implements Command {
  public cache: Cache;
  public data: SlashCommandBuilder = new SlashCommandBuilder();
  client: Tsuki | null = null;
  interaction: ChatInputCommandInteraction | null = null;
  constructor() {
    this.cache = new Cache();
    this.data
      .setName("appinfo")
      .setDescription(
        "-> Obtenha informações de um aplicativo Steam pelo seu AppID"
      )
      .addIntegerOption((i) =>
        i
          .setName("appid")
          .setDescription("-> AppID do aplicativo")
          .setRequired(true)
      );
  }

  setClient(client: Tsuki) {
    this.client = client;
    return this;
  }

  setInteraction(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
    return this;
  }

  async getAPI(appid: number) {
    const cache = this.cache.get(`${appid}`);

    if (cache) return cache as AxiosResponse;

    const api = await axios.get(
      `https://ares-api.lunixyz.repl.co/appinfo/${appid}`
    );
    this.cache.put(`${appid}`, api, 45);

    return api.data.data.apps[appid];
  }

  async execute() {
    if (!this.interaction || !this.client)
      throw console.log("NO INTERACTION/CLIENT!");

    const appid = this.interaction.options.getInteger("appid", true);
    const api = await this.getAPI(appid);
    if (!api || api.missingToken) {
      this.interaction.reply({
        content:
          "Esse aplicativo é privado e/ou Hestia não possui acesso a ele.",
        ephemeral: true,
      });
      return;
    }
    const embed = new BEmbed()
      .setTitle(`${api.appinfo?.common.name ?? "???"}`)
      .addFields(
        {
          name: "Change Number",
          value: `#${api.changenumber}`,
          inline: true,
        },
        {
          name: "Store Asset Time",
          value: `${new Date(
            api.appinfo.common.store_asset_mtime * 1000
          ).toDateString()}`,
          inline: true,
        },
        {
          name: "Primary Cache",
          value: `${api.appinfo.extended?.primarycache ?? "???"}`,
          inline: true,
        },
        {
          name: "Operating Systems",
          value: api.appinfo.common.oslist
            ? api.appinfo.common.oslist.split(",").join(", ")
            : "???",
          inline: true,
        }
      )
      .setThumbnail(
        `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${api.appinfo.common.icon}.jpg`
      )
      .setImage(
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${
          api.appinfo.common.header_image?.english ?? undefined
        }`
      );

    if (api.appinfo.depots.branches)
      embed.addFields({
        name: "Branches",
        value: `${
          Object.keys(api.appinfo.depots.branches).join(", ") ?? "???"
        }`,
      });

    if (api.appinfo.depots)
      embed.addFields({
        name: "Depots",
        value: `${Object.keys(api.appinfo.depots).join(", ") ?? "???"}`,
      });

    this.interaction.reply({
      embeds: [embed],
    });
  }
}
export default new AppInfo();
