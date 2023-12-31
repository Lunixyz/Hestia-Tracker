import {
  APIEmbed,
  ColorResolvable,
  EmbedAuthorData,
  EmbedBuilder,
  isJSONEncodable,
  JSONEncodable,
} from "discord.js";
export class BEmbed extends EmbedBuilder {

  setADC(ADC: {
    author: EmbedAuthorData;
    description: string;
    color: ColorResolvable;
  }) {
    return (
      super.setAuthor(ADC.author),
      super.setDescription(ADC.description),
      super.setColor(ADC.color)
    );
  }
  static from(other: JSONEncodable<APIEmbed> | APIEmbed) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}
