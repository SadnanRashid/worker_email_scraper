import { createPuppeteerRouter } from "crawlee";

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ page, request, log }) => {
    console.log("url: ", request.url);
    log.info(`Extracting HTML content for ${request.url}`);

    // Extract the HTML content of the page
    const htmlContent = await page.content();

    log.info(`HTML extracted and saved for ${request.url}`);

    console.log(htmlContent);
});
