import { IModuleParams, WSData } from "../types";
import * as Discord from "discord.js";
import io from "socket.io-client";
import moment from "moment";

export default ({ client, config, db, logger }: IModuleParams) => {

    const ws = io("http://localhost:8080");

    const handleQuest = async (message: any) => {
        logger.info("New EQ received. Sending...");
        const data: WSData = message;

        const channels: { id: string }[] = await db("channels")
            .select("id")
            .where({ shouldAlert: true });

        const embed = buildEmbed(data);
        const promises = channels.map(async dbChannel => {
            const channel = client.channels.get(dbChannel.id);

            if (!channel || channel.type !== "text") return;

            try {
                await (channel as Discord.TextChannel).send(embed);
            } catch (err) {}
        });

        await Promise.all(promises);
    }

    const logError = (err: any) => {
        console.error(err);
    }

    ws.on("quest", handleQuest);
    ws.on("connect", () => console.log("Connected"));
    ws.on("connect_timeout", logError);
    ws.on("connect_error", logError);

    ws.connect();

    client.on("message", async (message) => {
        if (message.channel.type !== "text") return;
        
        if (message.isMentioned(client.user) &&
            message.content.includes("help") ) {

            message.reply("Visit https://github.com/RodrigoLeiteF/WeebBot-v2 for help!");

        } else if (message.isMentioned(client.user) &&
            message.content.includes("alert") &&
            message.member.hasPermission("MANAGE_CHANNELS")) {

            const channels = await db("channels").where({
                id: message.channel.id
            }).limit(1);

            const channel = channels[0];

            if (channel) {
                await db("channels").update({
                    shouldAlert: channel.shouldAlert === 0 ? 1 : 0,
                });

                return message.reply(`Alerts ${channel.shouldAlert === 1 ? "disabled" : "enabled"}!`)
            } else {
                await db("channels").insert({
                    id: message.channel.id,
                    shouldAlert: true,
                });

                return message.reply("Alerts enabled!");
            }
        }
    });

    const buildEmbed = (data: WSData) => {
        const url = "https://github.com/RodrigoLeiteF/WeebBot-v2";
        const embed = new Discord.RichEmbed()
            .setAuthor("Emergency Quest Notice", "https://pso2.com/img/landing/mobile/m_logo.png", url)
            .setURL(url)
            .setFooter("https://leite.dev", "https://cdn.discordapp.com/app-icons/180088767669993474/b61c6a4ace2e651f08f15af40b9c7f62.png")
            .setTimestamp(new Date());

        embed.fields = data.upcoming.map(quest => {
            return {
                name: quest.date.difference,
                value: quest.name,
                inline: true,
            }
        });

        if (data.inProgress) {
            embed.setTitle("In Progress");
            embed.setDescription(data.inProgress.name);
        }

        return embed;
    }
}
