import {
  Bot,
  Context,
  session,
  SessionFlavor,
  webhookCallback,
  MemorySessionStorage,
} from "grammy";
import express from "express";

import { config } from "./config";

interface Image {
  url: string;
}

interface SessionData {
  pk: string;
}

export type MyContext = Context & SessionFlavor<SessionData>;

const token = config.telegramAPI;

export const bot = new Bot<MyContext>(token || "");

console.log("CONFIG", config.isProduction, config.port);

function initial(): SessionData {
  return {
    pk: ''
  };
}

bot.use(session({ initial, storage: new MemorySessionStorage() }));

bot.command("start", async (ctx) => {
  console.log("start command");
  await ctx.reply(`Welcome, ${ctx.from?.first_name}`);
});

bot.command("help", async (ctx) => {
  console.log("help command", ctx.session);
  await ctx.reply(`Welcome, ${ctx.from?.first_name}`);
});

bot.on("message", async (ctx) => {
  ctx.reply(`You wrote ${ctx.message.text}`)
});

if (config.isProduction) {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));
  app.use((_req, res) => res.status(200).send());
  const PORT = config.port;
  //@ts-ignore
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  console.log("Bot started (development)");
  bot.start();
}
