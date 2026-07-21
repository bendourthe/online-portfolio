import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const sources = [
    { id: "engineering-expertise", label: "Engineering Expertise", path: "content/skills/content/html/engineering-expertise_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "software-engineering", label: "Software Engineering", path: "content/skills/content/html/software-engineering_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "data-science", label: "Data Science", path: "content/skills/content/html/data-science_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "deep-learning", label: "AI & Machine Learning", path: "content/skills/content/html/deep-learning_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "agentic-engineering-devops", label: "Agentic Engineering & DevOps", path: "content/skills/content/html/agentic-engineering-devops_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "writing-communication", label: "Writing & Communication", path: "content/skills/content/html/writing-communication_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 },
    { id: "leadership-management", label: "Leadership & Management", path: "content/skills/content/html/leadership-management_html/index.html", layout: "fixed", responsive: true, width: 1905, height: 0 }
];

function projectUrl(absolutePath) {
    return relative(projectRoot, absolutePath).split("\\").join("/");
}

function isExternalUrl(value) {
    return /^(?:[a-z]+:|\/\/|#|data:|blob:|content\/)/i.test(value);
}

function rewriteDocumentUrls(content, sourceFile) {
    const sourceDirectory = dirname(sourceFile);
    return content
        .replace(/\b(src|href)=(['"])([^'"]+)\2/gi, (match, attribute, quote, value) => {
            if (isExternalUrl(value)) {
                return match;
            }
            return `${attribute}=${quote}${projectUrl(resolve(sourceDirectory, value))}${quote}`;
        })
        .replace(/url\((['"]?)([^)'"\s]+)\1\)/gi, (match, quote, value) => {
            if (isExternalUrl(value)) {
                return match;
            }
            return `url(${quote}${projectUrl(resolve(sourceDirectory, value))}${quote})`;
        });
}

function extractDocument(source) {
    const styles = Array.from(source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi), (match) => match[1]);
    const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
        throw new Error("Source document does not contain a body element.");
    }
    return { styles, body: bodyMatch[1].trim() };
}

function adaptDocumentSelectors(css) {
    return css
        .replace(/:root\b/g, ":host")
        .replace(/\bhtml\s*,\s*body\b/g, ".source-body")
        .replace(/\bbody\s*,\s*html\b/g, ".source-body")
        .replace(/(^|[},])\s*body\b/g, "$1 .source-body")
        .replace(/(^|[},])\s*html\b/g, "$1 .source-body");
}

function stripMediaBlocks(css) {
    let result = "";
    let cursor = 0;

    while (cursor < css.length) {
        const mediaStart = css.indexOf("@media", cursor);
        if (mediaStart === -1) {
            result += css.slice(cursor);
            break;
        }

        result += css.slice(cursor, mediaStart);
        const blockStart = css.indexOf("{", mediaStart);
        if (blockStart === -1) {
            result += css.slice(mediaStart);
            break;
        }

        let depth = 1;
        let blockEnd = blockStart + 1;
        while (blockEnd < css.length && depth > 0) {
            if (css[blockEnd] === "{") depth += 1;
            if (css[blockEnd] === "}") depth -= 1;
            blockEnd += 1;
        }
        cursor = blockEnd;
    }

    return result;
}

function normalizeResponsiveBreakpoints(css, sourceId) {
    const desktopBreakpoints = {
        "engineering-expertise": /max-width\s*:\s*1450px/g,
        "software-engineering": /max-width\s*:\s*1500px/g,
        "data-science": /max-width\s*:\s*1450px/g
    };
    const breakpoint = desktopBreakpoints[sourceId];
    return breakpoint ? css.replace(breakpoint, "max-width: 900px") : css;
}

async function readEmbeddedDocument(sourcePath) {
    const sourceFile = resolve(projectRoot, sourcePath);
    const sourceText = await readFile(sourceFile, "utf8");
    const document = extractDocument(sourceText);
    let body = document.body;
    const styles = [...document.styles];
    const iframePattern = /<iframe\b([^>]*?)\bsrc=(['"])([^'"]+)\2([^>]*)><\/iframe>/i;

    while (iframePattern.test(body)) {
        const match = body.match(iframePattern);
        const attributes = `${match[1]} ${match[4]}`;
        const classMatch = attributes.match(/\bclass=(['"])([^'"]+)\1/i);
        const titleMatch = attributes.match(/\btitle=(['"])([^'"]+)\1/i);
        const snippetFile = resolve(dirname(sourceFile), match[3]);
        const snippetText = await readFile(snippetFile, "utf8");
        const snippet = extractDocument(snippetText);
        const classes = [classMatch ? classMatch[2] : "", "inlined-source-frame"].filter(Boolean).join(" ");
        const title = titleMatch ? ` aria-label="${titleMatch[2].replace(/"/g, "&quot;")}"` : "";
        const replacement = `<div class="${classes}"${title}>${rewriteDocumentUrls(snippet.body, snippetFile)}</div>`;
        body = body.replace(match[0], replacement);
        styles.push(...snippet.styles.map((style) => rewriteDocumentUrls(style, snippetFile)));
    }

    return {
        body: rewriteDocumentUrls(body, sourceFile),
        css: adaptDocumentSelectors(styles.map((style) => rewriteDocumentUrls(style, sourceFile)).join("\n"))
    };
}

const payload = {};

for (const source of sources) {
    const document = await readEmbeddedDocument(source.path);
    payload[source.id] = {
        label: source.label,
        layout: source.layout,
        responsive: Boolean(source.responsive),
        mobileFluid: source.mobileFluid !== false,
        vertical: Boolean(source.vertical),
        width: source.width || null,
        height: source.height || null,
        html: document.body,
        css: source.responsive ? normalizeResponsiveBreakpoints(document.css, source.id) : source.layout === "fixed" ? stripMediaBlocks(document.css) : document.css
    };
}

const generatedFile = [
    "/* Generated by js/generate-skills-detail-source.mjs. Do not edit directly. */",
    "window.SKILLS_DETAIL_SOURCE = Object.freeze(" + JSON.stringify(payload) + ");",
    ""
].join("\n");

await writeFile(resolve(projectRoot, "js/skills-detail-source.js"), generatedFile, "utf8");
