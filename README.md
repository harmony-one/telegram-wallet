# telegram-wallet

## Setup

```
  yarn install
  yarn start
```

- Obtain a bot token by interacting with [@BotFather](https://t.me/botfathe)
- update .env variable file
- For bot deploying using webhook, it's required to configured the bot allowing updates with the following tool: https://tools.grammy.dev/webhook-utility

## Deployment

### Webhook deployment in fly.io

```bash
  fly launch
  fly secrets set ENV_PORT=VALUE, TELEGRAM_HTTP_KEY=KEY...
  fly deploy
```

### Linking Webhook to Telegram's bot

After fly.io deployment, retrieve Webhook url (e.g. https://telegram-bot.fly.dev) and run the following curl to linked webhook to the Telegram bot.

```bash
    curl "https://api.telegram.org/$TELEGRAM_HTTP_KEY/setWebhook?url=$WEBHOOK_URL"
```
