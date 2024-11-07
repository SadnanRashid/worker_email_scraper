import { Dataset, createPuppeteerRouter } from "crawlee";
import { getAllLinks, extractDataFromHtml } from "./parser.js";

export const router = (userUrl) => {
    const puppeteerRouter = createPuppeteerRouter();

    puppeteerRouter.addDefaultHandler(async ({ page, request, log }) => {
        const arrayOfData = [];
        let emailsTemp = [];
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

            // Extract emails from the linked page
            const linkedHtmlContent = await page.content();
            // console.log("linkedHtmlContent: ", linkedHtmlContent);
            const emails = extractDataFromHtml(linkedHtmlContent);

            // store emails in emailsTemp
            if (emails.length > 0) {
                emailsTemp.push(emails.join(","));
            }

            log.info(`Emails from ${link}: ${emails.join(", ") || "None"}`);
        }

        // store emails
        const dataObj = {
            url: userUrl?.url,
            emails: emailsTemp,
        };

        await Dataset.pushData(dataObj);

        // arrayOfData.push(dataObj);

        console.log("data: ", dataObj);
    });

    return puppeteerRouter;
};
