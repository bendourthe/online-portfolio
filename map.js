const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'content/skills/content/icons');
const htmlDir = path.join(__dirname, 'content/skills/content/html');

const folders = fs.readdirSync(iconsDir).filter(f => fs.statSync(path.join(iconsDir, f)).isDirectory());

const pageMapping = {
    'agentic-devops': 'agentic-engineering-devops_html',
    'ai-machine-learning': 'deep-learning_html',
    'data-science': 'data-science_html',
    'engineering-expertise': 'engineering-expertise_html',
    'leadership-management': 'leadership-management_html',
    'software-engineering': 'software-engineering_html',
    'writing-communication': 'writing-communication_html'
};

for (const folder of folders) {
    const htmlPage = pageMapping[folder];
    const htmlPath = path.join(htmlDir, htmlPage, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    const svgFiles = fs.readdirSync(path.join(iconsDir, folder)).filter(f => f.endsWith('.svg'));
    
    console.log(\nProcessing ...);
    // Find all <div class="principle">
    const parts = html.split('<div class="principle">');
    for (let i = 1; i < parts.length; i++) {
        const strongMatch = parts[i].match(/<strong[^>]*>(.*?)<\/strong>/);
        if (strongMatch) {
            const title = strongMatch[1].toLowerCase().replace(/&amp;/g, '&');
            console.log(  Title: );
        }
    }
}
