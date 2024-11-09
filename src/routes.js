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
            phoneNumbers: [],
        };

        log.info(`Processing base URL: ${request.url}`);

        // Get HTML content of the main page
        const htmlContent = await page.content();

        // Get all relevant links from this page
        const links = getAllLinks(htmlContent, request.url);

        let temp = 0; //for counting progess
        // Scrape and process each link sequentially
        for (const link of links) {
            const progress = Math.round(((temp + 1) / links.length) * 100);
            log.info(
                `Scraping website: ${request.url} (${progress}% complete)`
            );
            temp++;

            // Navigate to the link
            await page.goto(link, { timeout: 30000 });

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

            // log.info(`Data from ${link}: ${JSON.stringify(data)}`);
        }

        // Prepare final data object for dataset push
        const dataObj = {
            url: userUrl?.url,
            ...allDataTemp,
        };

        const foundData = Object.keys(allDataTemp)
            .filter((key) => allDataTemp[key] && allDataTemp[key].length > 0)
            .map((key) => key); // Collect keys with data
        if (foundData.length > 0) {
            log.info(
                `Scraped website: ${request.url} | Found: ${foundData.join(
                    ", "
                )}`
            );
        }

        const result = {
            url: dataObj.url,
            emails: dataObj.emails,
            phone: dataObj.phoneNumbers,
            linkedin: dataObj.linkedin[0] || null,
            facebook: dataObj.facebook[0] || null,
            twitter: dataObj.twitter[0] || null,
            tiktok: dataObj.tiktok[0] || null,
            pinterest: dataObj.pinterest[0] || null,
            instagram: dataObj.instagram[0] || null,
        };

        console.log(result);

        await Dataset.pushData(result);
    });

    return puppeteerRouter;
};
