import { Actor } from "apify";
import { PuppeteerCrawler, RequestQueue } from "crawlee";
import { router } from "./routes.js";

await Actor.init();

const input = await Actor.getInput();
const userUrls = input?.startUrls || [];

const totalUrls = userUrls.length;
let completedCount = 0;
let failedCount = 0;

const requestQueue = await RequestQueue.open();

// Add each user URL to the queue with userData to pass the original URL
for (const userUrl of userUrls) {
    await requestQueue.addRequest({
        url: userUrl.url,
        userData: { originalUrl: userUrl.url },
    });
}

const crawler = new PuppeteerCrawler({
    requestQueue,
    maxConcurrency: 5,
    maxRequestRetries: 2,
    requestHandler: router(),

    // On success, increment completed count and update status message
    handlePageFunction: async ({ request }) => {
        completedCount++;
        await Actor.setStatusMessage(
            `Crawled ${completedCount}/${totalUrls} Websites, ${failedCount} Failed Requests`
        );
    },

    // On error, increment failed count and update status message
    handleFailedRequestFunction: async ({ request }) => {
        failedCount++;
        await Actor.setStatusMessage(
            `Crawled ${completedCount}/${totalUrls} Websites, ${failedCount} Failed Requests`
        );
    },
});

// Run the crawler
await crawler.run();

await Actor.exit(
    `Crawling completed: ${completedCount}/${totalUrls} Websites, ${failedCount} Failed Requests`
);
