# Mod Update Server

> [!IMPORTANT]
> This project is used to download assets on behalf of [this](https://github.com/theLeialoha) organization.
> You will have to modify the code a bit to have it manage multiple organizations & users.

A server for Minecraft modders that manages all your assets.

## Useful Links

- [Runtime Assets](https://github.com/theLeialoha/runtime-assets)

---

## Requests

| Method   | Path                               | Description                                                                                                        |
|----------|------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `GET`    | `/mods`                            | A list of all mods.                                                                                                |
| `GET`    | `/mods/MOD_ID/index.json`          | A list of assets by a mod from its mod ID.                                                                         |
| `GET`    | `/mods/MOD_ID`                     | A list of assets by a mod from its mod ID. *(alias of `/mods/MOD_ID/index.json`)*                                  |
| `GET`    | `/mods/MOD_ID/PATH`                | Gets a specific asset based on path.                                                                               |
| `DELETE` | `/mods/MOD_ID`                     | Deletes a mod & it's assets. Requires an apikey in the header.                                                     |
| `POST`   | `/mods/add`                        | Adds a new mod. Requires an apikey in the header. See [Mod](#mod).                                                 |
| `POST`   | `/mods/MOD_ID/edit`                | Edits an existing mod. Requires an apikey in the header. See [Mod](#mod).                                          |
| `POST`   | `/mods/MOD_ID/pack`                | Compresses assets into pack (ie. resourcepack, datapack). See [Pack Format](https://minecraft.wiki/w/Pack_format). |
| `GET`    | `/apikeys`                         | A list of all API keys.                                                                                            |
| `POST`   | `/apikeys/add`                     | Adds a new API keys. See [ApiKey](#apikey).                                                                        |
| `DELETE` | `/apikeys/APIKEY`                  | Removes an API keys.                                                                                               |

**Example Mod**

```json5
{
  "modID": "examplemod",
  // The mod ID (used to identify the mod)
  "name": "Example Mod",
  // The name of the mod
}
```

**Example ApiKey**

```json5
{
  "mods": [
    "examplemod"
  ]
  // The mods that this key has access to ("*" for every mod)
}
```

## Development Setup

For GitHub setup, see [this](github_setup.md).

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Installation

```sh
./yarn build
./yarn start
```

### Running the project in development

```sh
./yarn dev
```

## Environment Variables

| Variable         | Description                                                     | Default Value |
|------------------|-----------------------------------------------------------------|---------------|
| `DB_PROTOCOL`    | The Protocol of the MongoDB database                            | `mongodb`     |
| `DB_HOSTNAME`    | The IP / Hostname of the MongoDB database                       | ` `           |
| `DB_PORT`        | The port of the MongoDB database                                | ` `           |
| `DB_NAME`        | The database name                                               | ` `           |
| `DB_USERNAME`    | The database username                                           | ` `           |
| `DB_PASSWORD`    | The database password                                           | ` `           |
| `HOST`           | The webserver hostname                                          | `0.0.0.0`     |
| `PORT`           | The webserver port                                              | `8080`        |
| `MASTER_KEY`     | The master apiKey (e.g. `62387f34-7678-4737-bfc4-2cb600337541`) | ` `           |
