# SkyBrance Node.js SDK

SkyBrance Node.js SDK is a monorepo with two packages:

- `@skybrance/auth` for authenticated API requests.
- `@skybrance/link-shortner` for link management, analytics, OG image upload, and link deletion.

## Workspace Structure

```text
packages/
  auth/
  link-shortner/
```

## Install

Install dependencies from the workspace root:

```bash
npm install
```

## Build

Build each package independently:

```bash
npm --workspace @skybrance/auth run build
npm --workspace @skybrance/link-shortner run build
```

## Package Overview

### `@skybrance/auth`

The auth package exports `SkyBranceClient`.

Constructor options:

- `apiKeyId` and `apiKeySecret` are required.
- `environment` can be `development` or `production`.
- `customDomain` overrides the API host.
- `version` defaults to `v1.0.0`.

Methods:

- `request(endpoint, options)` sends an authenticated JSON request.
- `verify()` checks whether the credentials are valid.

Development base URL:

```text
http://localhost:15000/api-user
```

Production base URL:

```text
https://api.skybrance.com/api-user
```

### `@skybrance/link-shortner`

The link shortener package exports `SkyBranceLinkShortener` and the related response types.

Methods:

- `create(params)` creates a shortened link.
- `update(id, params)` updates an existing link.
- `getById(id, numberOfPastDays?)` fetches a link with analytics history.
- `uploadOgImage(id, { contentType })` generates an OG image upload URL.
- `deleteById(id)` deletes a link.
- `getList(filters?)` returns paginated links.

Supported OG image content types:

- `image/jpeg`
- `image/png`
- `image/jpg`
- `image/webp`

## Example Usage

```ts
import { SkyBranceClient } from "@skybrance/auth";
import { SkyBranceLinkShortener } from "@skybrance/link-shortner";

const client = new SkyBranceClient({
  apiKeyId: process.env.API_KEY_ID,
  apiKeySecret: process.env.API_KEY_SECRET,
  environment: "development",
});

const links = new SkyBranceLinkShortener(client);

const created = await links.create({
  url: "https://example.com",
  title: "Example",
});

const details = await links.getById(created._id, 7);
const ogImage = await links.uploadOgImage(created._id, {
  contentType: "image/jpeg",
});
await links.deleteById(created._id);
```

## Package Scripts

Each package exposes a `build` script. The package test files are runnable with `tsx` and read credentials from `.env`.

## License

MIT
