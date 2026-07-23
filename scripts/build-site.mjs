import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "dist");
const publicFiles = [
    "index.html",
    "skills.html",
    "css/owl.carousel.min.css",
    "css/skills_detail.css",
    "css/skills_detail_tokens.css",
    "css/style_modern.css",
    "css/superslides.css",
    "js/countUp.js",
    "js/countUp-jquery.js",
    "js/jquery.easypiechart.min.js",
    "js/jquery.superslides.min.js",
    "js/owl.carousel.min.js",
    "js/script.js",
    "js/skills-detail.js",
    "js/skills-detail-config.js",
    "js/skills-detail-source.js",
    "js/skills-source-artwork.js",
    "js/typed.min.js",
];
const publicDirectories = ["assets", "content", "favicon", "nexus-hub"];
const optionalReferences = new Set([
    "css/owl.carousel.min.css -> owl.video.play.png",
    "js/owl.carousel.min.js -> +c+",
]);

function assertInsideProject(path) {
    const prefix = projectRoot.endsWith(sep) ? projectRoot : projectRoot + sep;
    if (path !== projectRoot && !path.startsWith(prefix)) {
        throw new Error(`Path is outside the project: ${path}`);
    }
}

async function filesUnder(root) {
    const files = [];
    for (const entry of await readdir(root, { withFileTypes: true })) {
        const path = resolve(root, entry.name);
        if (entry.isDirectory()) files.push(...await filesUnder(path));
        if (entry.isFile()) files.push(path);
    }
    return files;
}

function normalizeReference(value) {
    return value.trim().replace(/^['"]|['"]$/g, "").split(/[?#]/, 1)[0].replace(/\\/g, "/");
}

function localReferences(text) {
    const values = [];
    for (const match of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) values.push(match[1]);
    for (const match of text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) values.push(match[1]);
    for (const match of text.matchAll(/["'`]((?:assets|content|css|favicon|js|nexus-hub)\/[^"'`]+?\.(?:avif|css|gif|html|ico|jpe?g|js|json|png|svg|webmanifest|webp)(?:\?[^"'`]*)?)["'`]/gi)) values.push(match[1]);
    return values
        .map(normalizeReference)
        .filter((value) => value && !/^(?:[a-z]+:|\/\/|#|data:|blob:)/i.test(value));
}

assertInsideProject(outputRoot);
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const publicFile of publicFiles) {
    const target = resolve(outputRoot, publicFile);
    await mkdir(dirname(target), { recursive: true });
    await cp(resolve(projectRoot, publicFile), target);
}
for (const directory of publicDirectories) {
    await cp(resolve(projectRoot, directory), resolve(outputRoot, directory), { recursive: true });
}

const embeddedArtwork = await readFile(resolve(projectRoot, "js/skills-source-artwork.js"), "utf8");
const outputFiles = await filesUnder(outputRoot);
const textFiles = outputFiles.filter((path) => [".css", ".html", ".js", ".json", ".webmanifest"].includes(extname(path).toLowerCase()));
const missing = new Set();

for (const textFile of textFiles) {
    const text = await readFile(textFile, "utf8");
    for (const reference of localReferences(text)) {
        const target = reference.startsWith("/")
            ? resolve(outputRoot, reference.slice(1))
            : reference.startsWith("assets/") || reference.startsWith("content/") || reference.startsWith("css/") || reference.startsWith("favicon/") || reference.startsWith("js/") || reference.startsWith("nexus-hub/")
                ? resolve(outputRoot, reference)
                : resolve(dirname(textFile), reference);
        try {
            await stat(target);
        } catch {
            const source = relative(outputRoot, textFile).split(sep).join("/");
            const diagnostic = `${source} -> ${reference}`;
            if (!embeddedArtwork.includes(JSON.stringify(reference)) && !optionalReferences.has(diagnostic)) {
                missing.add(diagnostic);
            }
        }
    }
}

if (missing.size) {
    throw new Error(`Missing local references:\n${[...missing].sort().join("\n")}`);
}

const totalBytes = (await Promise.all(outputFiles.map(async (path) => (await stat(path)).size))).reduce((sum, size) => sum + size, 0);
console.log(`Built dist with ${outputFiles.length} files (${(totalBytes / 1024 / 1024).toFixed(2)} MB); all local references resolved.`);
