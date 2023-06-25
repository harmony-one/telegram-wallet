import {
  Bot,
  Context,
  session,
  SessionFlavor,
  webhookCallback,
  MemorySessionStorage,
} from "grammy";
import { type ChatMember } from "grammy/types";
import { chatMembers, type ChatMembersFlavor } from "@grammyjs/chat-members";

import express from "express";

import { config } from "./config";
import { mainMenu } from "./pages/main";
import { multisigMenu } from "./pages/multisig";

interface SessionData {
  pk: string;
  askForMultising: boolean;
}

export type MyContext = Context & SessionFlavor<SessionData> & ChatMembersFlavor;

const adapter = new MemorySessionStorage<ChatMember>();

const token = config.telegramAPI;

export const bot = new Bot<MyContext>(token || "");

function initial(): SessionData {
  return {
    pk: "",
    askForMultising: true,
  };
}

bot.use(session({ initial, storage: new MemorySessionStorage() }));
bot.use(mainMenu);
bot.use(multisigMenu);

bot.use(chatMembers(adapter));

bot.command("start", async (ctx) => {
  console.log("start command");
  console.log(ctx.chat.type);
  await ctx.reply(`Welcome, ${ctx.from?.first_name}`, {
    reply_markup: mainMenu,
  });
});

bot.command("help", async (ctx) => {
  console.log("help command", ctx.session);
  console.log(await ctx.api.getChatMember(ctx.chat?.id!, ctx.from?.id!));
  await ctx.reply(`Welcome, ${ctx.from?.first_name}`, {
    reply_markup: mainMenu,
  });
});

bot.command("multisig", async (ctx) => {
  if(ctx.chat.type === 'group') {
    await ctx.reply(
      "You can create a multisig Wallet with the members of this chat",
      {
        reply_markup: multisigMenu,
      }
    );
  } else {
    await ctx.reply('You have to be on a chat group. The chat members will be on the Mulitisig')
  }
});

bot.on(":new_chat_members:me", async (ctx) => {
  console.log(":new_chat_members:me", ctx.session);
  if (ctx.chat.type === "group") {
    ctx.reply(
      "You can create a multisig Wallet with the members of this chat",
      {
        reply_markup: multisigMenu,
      }
    );
  }
});

bot.on("message", async (ctx) => {

  // console.log(ctx.chat.type)
  // if (ctx.chat.type !== 'private') {
  //   ctx.reply(`Please set the multisig ${ctx.chat.type}`)
  // }
  // ctx.reply(`You wrote ${ctx.message.text}`)
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
  bot.start({
    allowed_updates: ["chat_member", "message", "callback_query"],
  });
}
