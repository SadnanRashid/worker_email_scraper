import { Dataset, createPuppeteerRouter } from "crawlee";
import { getAllLinks, extractDataFromHtml } from "./parser.js";

export const router = (userUrl) => {
    const puppeteerRouter = createPuppeteerRouter();

    puppeteerRouter.addDefaultHandler(async ({ page, request, log }) => {
        let allDataTemp = {
            emails: [],
            linkedin: [],
            facebook: [],
            twitter: [],
            tiktok: [],
            pinterest: [],
            instagram: [],
        };

        log.info(`Processing base URL: ${userUrl}`);

        // Get HTML content of the main page
        const htmlContent = await page.content();

        // Get all relevant links from this page
        const links = getAllLinks(htmlContent, request.url);
        console.log("links: ", links);

        // Scrape and process each link sequentially
        for (const link of links) {
            log.info(`Scraping link: ${link}`);

            // Navigate to the link
            await page.goto(link);

            // Extract data (emails and social media links) from the linked page
            const linkedHtmlContent = await page.content();
            const data = extractDataFromHtml(linkedHtmlContent);

            // Add data to allDataTemp, ensuring uniqueness
            for (const key in allDataTemp) {
                if (data[key] && data[key].length > 0) {
                    allDataTemp[key] = [
                        ...new Set([...allDataTemp[key], ...data[key]]),
                    ];
                }
            }

            log.info(`Data from ${link}: ${JSON.stringify(data)}`);
        }

        // Prepare final data object for dataset push
        const dataObj = {
            url: userUrl?.url,
            ...allDataTemp,
        };

        await Dataset.pushData(dataObj);

        console.log("Data pushed to dataset: ", dataObj);
    });

    return puppeteerRouter;
};
