import * as cheerio from "cheerio";
import url from "url";

const getAllLinks = (html, baseUrl) => {
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

    links.add(baseUrl); // Add the base URL

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

    return Array.from(links).slice(0, 6); // Return up to 6 unique links
};

const extractDataFromHtml = (html) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex);

    if (!emails) return [];

    // Filter, sanitize, and validate emails and ofcourse remove file extensions
    const filteredEmails = emails
        .map((email) => email.replace(/^mailto:/i, "")) // Remove "mailto:" if it exists
        .filter((email) => {
            // Exclude emails with unwanted file extensions
            const isValidDomain =
                !/\.(png|jpg|jpeg|gif|bmp|svg|webp|pdf|doc|docx|xls|xlsx)$/i.test(
                    email
                );
            const isValidFormat =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            return isValidDomain && isValidFormat;
        });

    return [...new Set(filteredEmails)]; // Return unique emails
};

export { getAllLinks, extractDataFromHtml };
