import * as cheerio from "cheerio";
import url from "url";

const getAllLinks = (html, baseUrl) => {
    console.log("baseUrl", baseUrl);
    const $ = cheerio.load(html);

    const targetTerms = [
        // English
        "about",
        "contact",
        "support",
        "help",
        "team",
        "careers",
        // Spanish
        "acerca",
        "contacto",
        "soporte",
        "cliente",
        "ayuda",
        "equipo",
        "carreras",
        "empleo",
        // French
        "propos",
        "contact",
        "support",
        "client",
        "aide",
        "équipe",
        "carrières",
        "emplois",
        // Chinese (Simplified)
        "关于",
        "联系",
        "支持",
        "客户",
        "帮助",
        "团队",
        "招聘",
        "问题",
    ];

    const links = new Set();
    const baseDomain = new URL(baseUrl).hostname;

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const fullUrl = url.resolve(baseUrl, href);
            const linkDomain = new URL(fullUrl).hostname;

            // Only add if link domain matches the base domain and link includes target terms
            if (
                linkDomain === baseDomain &&
                targetTerms.some((term) => fullUrl.toLowerCase().includes(term))
            ) {
                links.add(fullUrl);
            }
        }
    });

    return Array.from(links).slice(0, 5); // Return up to 5 unique links
};

export { getAllLinks };
