import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";
import { router } from "./routes.js";

await Actor.init();

const input = await Actor.getInput();
const userUrls = input?.startUrls || [];

for (const userUrl of userUrls) {
    // For each user URL, create and run a separate crawler instance
    const crawler = new PuppeteerCrawler({
        requestHandler: router(userUrl), // Pass the current URL to router for separate handling
    });

    // Use an array of simple URL strings instead of nested objects
    await crawler.run([{ url: userUrl.url }]); // Corrected: flatten userUrl
}

await Actor.exit();
