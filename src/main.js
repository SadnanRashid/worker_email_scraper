import { Actor } from "apify";
import { PuppeteerCrawler, RequestQueue } from "crawlee";
import { router } from "./routes.js";

await Actor.init();

const input = await Actor.getInput();
const userUrls = input?.startUrls || [];

const totalUrls = userUrls.length;

const requestQueue = await RequestQueue.open();

// Add each user URL to the queue with userData to pass the original URL
for (const userUrl of userUrls) {
    await requestQueue.addRequest({
        url: userUrl.url,
    });
}

const crawler = new PuppeteerCrawler({
    requestQueue,
    maxConcurrency: 3,
    maxRequestRetries: 2,
    requestHandler: router(),

    // On error, increment failed count and update status message
    // failedRequestHandler: async ({ request }) => {
    //     failedCount++;
    //     await Actor.setStatusMessage(
    //         `Crawled ${completedCount}/${totalUrls} Websites, ${failedCount} Failed Requests`
    //     );
    // },
});

// Run the crawler
await crawler.run();

await Actor.exit("Completed the scraping process!");

// export totalUrls
export { totalUrls };
