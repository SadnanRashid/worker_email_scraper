import { createPuppeteerRouter } from "crawlee";
import { getAllLinks } from "./parser.js";

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ page, request, log }) => {
    log.info(`Extracting HTML content for ${request.url}`);

    // Extract the HTML content of the page
    const htmlContent = await page.content();

    const links = getAllLinks(htmlContent, request.url);

    log.info(`HTML extracted and saved for ${request.url}`);

    console.log(links);

    // console.log(htmlContent);
});
