# @skybrance/auth

SkyBrance authentication client for building authenticated SDK requests.

## Install

```bash
npm install @skybrance/auth
```

## Usage

```ts
import { SkyBranceClient } from "@skybrance/auth";

const client = new SkyBranceClient({
  apiKeyId: process.env.API_KEY_ID,
  apiKeySecret: process.env.API_KEY_SECRET,
  environment: "development",
});

await client.verify();
```

## Configuration

`SkyBranceClient` accepts these options:

`apiKeyId` and `apiKeySecret` are required.

`environment` can be `development` or `production`.

`customDomain` overrides the default API base URL.

`version` overrides the API version path and defaults to `v1.0.0`.

## Methods

`request(endpoint, options)` sends an authenticated JSON request and returns the parsed response body.

`verify()` checks whether the credentials are valid.

## Base URLs

In development, the client uses `http://localhost:15000/api-user`.

In production, the client uses `https://api.skybrance.com/api-user`.

If `customDomain` is set, that value is used instead.
