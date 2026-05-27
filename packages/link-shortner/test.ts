
import { SkyBranceClient } from '@skybrance/auth';
import { SkyBranceLinkShortener } from './index';
declare const process: any;

async function run() {
    if (!process.env.API_KEY_ID || !process.env.API_KEY_SECRET) {
        throw new Error("Missing test credentials in .env file");
    }

    const authClient = new SkyBranceClient({
        apiKeyId: process.env.API_KEY_ID,
        apiKeySecret: process.env.API_KEY_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    });

    const links = new SkyBranceLinkShortener(authClient);

    try {
        console.log("1. Creating test target link...");
        const newLink = await links.create({
            url: 'https://www.youtube.com/',
            title: 'Initial Title'
        });
        console.log("Link Created!\n");

        console.log("2. Executing update on the link...");
        const updatedLink = await links.update(newLink._id, {
            title: "Test: Title update test ",
            description: "Test: This is description."
        });
        console.log("Link Updated!\n");

        console.log("3. Fetching link by ID with analytics history...");
        const fetchedLink = await links.getById(newLink._id, 7);
        console.log("Fetched Link by ID!\n");

        console.log("4. Creating OG image upload URL...");
        const ogImageUpload = await links.uploadOgImage(newLink._id, {
            contentType: 'image/jpeg'
        });
        console.log("OG Image Upload URL Generated!",);

        console.log("5. Deleting the test link...");
        const deletedLink = await links.deleteById(newLink._id);
        console.log("Link Deleted!\n");

        console.log("6. Fetching paginated list of links with filters...");
        const response = await links.getList();
        console.log(`Total Links available on platform: ${response.pagination.total}`);

        console.log("\n+----------------------------------------+");
        console.log("|    All tests executed successfully!    |");
        console.log("+----------------------------------------+");

    } catch (error: any) {
        console.error("Link Creation Failed:", error.message);
    }
}

run();