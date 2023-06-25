import { Menu } from "@grammyjs/menu";
import { Context } from "grammy";

import { MyContext } from "../bot";

export const multisigMenu = new Menu<MyContext>("multisig-menu")
  .submenu("Multisig Manager", "multisig-options");

export const multisigOptions = new Menu<MyContext>("multisig-options")
  .text("I want to create a multisig", (ctx) => createMultisig(ctx))
  .row()
  .back("I don't need to create a multisig")
  .row()
  .url(
    "What is a multisig?",
    "https://blockworks.co/news/what-are-multisig-wallets"
  );

const createMultisig = (ctx: Context) => {
  ctx.reply("TBD");
};

multisigMenu.register(multisigOptions)
