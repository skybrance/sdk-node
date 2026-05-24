# SkyBrance Node.js SDK

The official Node.js SDK for [SkyBrance](https://skybrance.com) services. Integrate link shortening, analytics, and other SkyBrance features into your applications.

## Installation

Install from npm:

```bash
npm install @skybrance/sdk-node
```

## Quick Start

Initialize the SDK with your API key and create a shortened link.

### JavaScript (CommonJS)

```javascript
const { SkyBranceClient } = require("@skybrance/sdk-node");

// Initialize the client
const skybrance = new SkyBranceClient("YOUR_API_KEY");

// Example: Create a new shortened link
async function run() {
  try {
    const link = await skybrance.createLink({
      url: "https://google.com",
      customAlias: "my-link",
    });
    console.log("Shortened link:", link.shortUrl);
  } catch (error) {
    console.error("Error creating link:", error.message);
  }
}

run();
```

### TypeScript / ESM

```ts
import { SkyBranceClient } from "@skybrance/sdk-node";

const skybrance = new SkyBranceClient(process.env.SKYBRANCE_API_KEY || "");

// Use the same API methods as shown in the JavaScript example
```

## Features

- Link Shortening — Easily shorten long URLs.
- Analytics — Track clicks and engagement for your generated links.
- TypeScript Support — Full type definitions for a better developer experience.

## Documentation

For full API reference and advanced usage, see the official documentation on the SkyBrance website.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please open issues or pull requests and follow the contributing guidelines.
