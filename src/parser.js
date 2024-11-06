const cheerio = require("cheerio");

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

    $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
            const fullUrl = url.resolve(baseURL, href);
            const lowerHref = href.toLowerCase();
            if (
                targetTerms.some((term) => lowerHref.includes(term)) &&
                !links.has(fullUrl)
            ) {
                links.add(fullUrl);
            }
        }
    });

    return Array.from(links).slice(0, 5); // Return up to 5 unique links
};

module.exports = {
    getAllLinks,
};
