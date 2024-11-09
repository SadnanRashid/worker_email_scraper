import * as cheerio from "cheerio";

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
            const fullUrl = new URL(href, baseUrl).toString(); // Resolve full URL
            const linkDomain = new URL(fullUrl).hostname;

            // Check if the link matches the base domain and contains target terms
            if (
                linkDomain === baseDomain &&
                targetTerms.some((term) => fullUrl.toLowerCase().includes(term))
            ) {
                // Extract the pathname of the URL and split by '/'
                const pathSegments = new URL(fullUrl).pathname
                    .split("/")
                    .filter(Boolean);

                // Only add if there is a single segment in the path (e.g., "domain/about", "domain/contact")
                if (pathSegments.length <= 1) {
                    links.add(fullUrl);
                }
            }
        }
    });

    return Array.from(links).slice(0, 6); // Return up to 6 unique links
};

const extractDataFromHtml = (html) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    // Regex for capturing phone numbers with optional country code, spaces, hyphens, dots, and brackets
    const phoneRegex =
        /(\(?\+\d{1,3}\)?\s?)?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}\b/g;

    // Regexes for capturing social media links
    const socialMediaRegexes = {
        linkedin:
            /https?:\/\/(www\.)?linkedin\.com\/(company|in|groups)\/[a-zA-Z0-9_-]+/gi,
        facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.-]+/gi,
        twitter: /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+/gi,
        tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._-]+/gi,
        pinterest: /https?:\/\/(www\.)?pinterest\.com\/[a-zA-Z0-9_/]+/gi,
        instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+/gi,
    };

    const extractedData = {
        emails: [],
        phoneNumbers: [],
        linkedin: [],
        facebook: [],
        twitter: [],
        tiktok: [],
        pinterest: [],
        instagram: [],
    };

    // Extract emails
    const emails = html.match(emailRegex);
    if (emails) {
        const filteredEmails = emails
            .map((email) => email.replace(/^mailto:/i, ""))
            .filter((email) => {
                const isValidDomain =
                    !/\.(png|jpg|jpeg|gif|bmp|svg|webp|pdf|doc|docx|xls|xlsx)$/i.test(
                        email
                    );
                const isValidFormat =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        email
                    );
                const isValidMailDomain =
                    email.split("@")[1].split(".").length === 2;
                return isValidDomain && isValidFormat && isValidMailDomain;
            });

        extractedData.emails = [...new Set(filteredEmails)];
    }

    // Extract phone numbers
    const phoneNumbers = html.match(phoneRegex);
    console.log("Phone: ", phoneNumbers);
    if (phoneNumbers) {
        const filteredPhoneNumbers = phoneNumbers.map((phone) => phone.trim());
        extractedData.phoneNumbers = [...new Set(filteredPhoneNumbers)];
    }

    // Extract social media links
    for (const [platform, regex] of Object.entries(socialMediaRegexes)) {
        const match = html.match(regex);
        if (match) {
            extractedData[platform] = [...new Set(match)];
        }
    }

    console.log("Phone::", extractedData.phoneNumbers);

    return extractedData;
};

export { getAllLinks, extractDataFromHtml };
