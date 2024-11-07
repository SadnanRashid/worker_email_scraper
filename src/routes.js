import { createPuppeteerRouter } from "crawlee";
import { getAllLinks } from "./parser.js";

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ page, request, log }) => {
    log.info(`Extracting HTML content for ${request.url}`);

    // Extract the HTML content of the page
    const htmlContent = await page.content();

    // Get all possible links that might contain the data (email/socials)
    const links = getAllLinks(htmlContent, request.url);

    log.info(`HTML extracted and saved for ${request.url}`);

    // console.log(htmlContent);
});
