import { SkyBranceClient } from './index';
declare const process: any;

async function run() {
    const authClient = new SkyBranceClient({
        apiKeyId: process.env.API_KEY_ID,
        apiKeySecret: process.env.API_KEY_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    });

    try {
        await authClient.verify();

        console.log("\n+----------------------------------------+");
        console.log("|    All tests executed successfully!    |");
        console.log("+----------------------------------------+");

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

run();