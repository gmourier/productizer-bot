# productizer-bot

[DEMO](https://github.com/gmourier/productizer-bot/discussions/2)

A simple bot that helps product teams manage feedback from Github discussions to stay in sync with ProductBoard.

- The bot comments a gentle message after the discussion has been created.
- The bot sends every comment content as a new note to ProductBoard. (except its own)
    - `origin:github` and `waiting:triage` tags are set on ProductBoard notes.
    - `display_url` ProductBoard Note's field is filled with the Github comment link.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t productizer-bot

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value>  -e WEBHOOK_SECRET=<webhook-secret> -e PRODUCTBOARD_TOKEN=<productboard-token> productizer-bot
```

## Deployment

> 💡DO NOT FORGET YOUR PRODUCTBOARD_TOKEN!

https://probot.github.io/docs/deployment/

> `api/github/webhooks` folder is here to deploy the bot as a serverless function on Vercel.

## Contributing

If you have suggestions for how productizer-bot could be improved open a discussion. If you want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2022 Guillaume Mourier
