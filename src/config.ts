import { IConfig } from "./types";

export default {
  token: process.env.WB_DISCORD_TOKEN || "",
  websocketUrl: process.env.WB_API_URL || "http://pso2.rodrigo.li/eq/",
  database: {
    client: process.env.WB_DATABASE_CLIENT || "mysql",
    connection: {
      host: process.env.WB_DATABASE_HOST || "127.0.0.1",
      user: process.env.WB_DATABASE_USER || "root",
      password: process.env.WB_DATABASE_PASSWORD || "",
      database: process.env.WB_DATABASE || "weebbot"
    }
  },
  presence: {
    game: {
      name: process.env.WB_GAME_NAME || "https://leite.dev",
      url: process.env.WB_GAME_URL || "https://leite.dev"
    },
    status: "online"
  },
  log: {
    guild: process.env.WB_LOG_GUILD || "",
    channel: process.env.WB_LOG_CHANNEL || ""
  }
} as IConfig
