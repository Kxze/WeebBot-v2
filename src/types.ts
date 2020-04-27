import * as Discord from "discord.js";
import * as Knex from "knex";
import * as Winston from "winston";

export interface IConfig {
  token: string;
  websocketUrl: string;
  database: Knex.Config;
  presence: Discord.PresenceData;
  log: ILogConfig;
}

export interface ILogConfig {
  guild: string;
  channel: string;
}

export interface IModuleParams {
  client: Discord.Client;
  config: IConfig;
  db: Knex;
  logger: Winston.Logger;
}

export interface IEQ {
  name: string;
  jpName: string;
  ship: number;
}

export interface IEQData {
  time: string;
  when: string;
  eqs: IEQ[];
}

export interface IDBChannel {
  guildId: string;
  channelId: string;
  ships: string;
}

export type WSData = {
    id: string,
    date: Date,
    inProgress?: Quest,
    upcoming: Quest[]
}

export type Quest = {
    name: string;
    date: Date;
}

export type Date = {
    JP: string;
    UTC: string;
    difference: string;
}
