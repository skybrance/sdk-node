# @skybrance/link-shortner

SkyBrance link shortener SDK built on top of `@skybrance/auth`.

## Install

```bash
npm install @skybrance/link-shortner @skybrance/auth
```

## Usage

```ts
import { SkyBranceClient } from "@skybrance/auth";
import { SkyBranceLinkShortener } from "@skybrance/link-shortner";

const client = new SkyBranceClient({
  apiKeyId: process.env.API_KEY_ID,
  apiKeySecret: process.env.API_KEY_SECRET,
  environment: "development",
});

const links = new SkyBranceLinkShortener(client);
```

## Create a Link

```ts
await links.create({
  url: "https://example.com",
  title: "Example",
});
```

## Update a Link

```ts
await links.update(linkId, {
  title: "Updated title",
  description: "Updated description",
});
```

## Fetch a Link

```ts
await links.getById(linkId, 7);
```

## Upload OG Image

```ts
await links.uploadOgImage(linkId, {
  contentType: "image/jpeg",
});
```

## Delete a Link

```ts
await links.deleteById(linkId);
```

## List Links

```ts
await links.getList({
  page: 1,
  limit: 10,
  search: "example",
  isPasswordProtected: false,
  minimumclicks: 0,
});
```

## API Summary

`create(params)` creates a shortened link.

`update(id, params)` updates an existing link.

`getById(id, numberOfPastDays?)` fetches a link with analytics history.

`uploadOgImage(id, { contentType })` generates an OG image upload URL.

`deleteById(id)` deletes a link.

`getList(filters?)` returns paginated links.

## Returned Data

The link detail response includes the link record, the public short link, analytics, and graph data.

The OG image upload response includes `uploadUrl` and `publicUrl`.
