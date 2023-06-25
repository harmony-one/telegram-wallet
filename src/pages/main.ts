import { Menu } from "@grammyjs/menu";
import { Context } from "grammy";

import { MyContext } from "../bot";

export const mainMenu = new Menu<MyContext>("main-menu") //<MyContext>
  .text("Wallet", (ctx) => walletAction(ctx))

// name to be defined
const walletAction = (ctx: Context) => {
  const userId = ctx.from?.id;
  console.log("chat/user", ctx.chat?.id, userId);
  ctx.reply("Name to be defined, could be a submenu");
};
