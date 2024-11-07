import { createPuppeteerRouter } from "crawlee";
import { getAllLinks, extractDataFromHtml } from "./parser.js";

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ page, request, log }) => {
    const arrayOfData = [];
    log.info(`Extracting HTML content for ${request.url}`);

    // Extract the HTML content of the page
    const htmlContent = await page.content();

    // Get all possible links that might contain the data (email/socials)
    const links = getAllLinks(htmlContent, request.url);

    // Here I want to scrape all links (links array) and use extractDataFromHtml to get the emails

    log.info(`HTML extracted and saved for ${request.url}`);

    // console.log(htmlContent);
});
