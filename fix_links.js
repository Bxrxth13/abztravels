const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let html = fs.readFileSync(file, 'utf8');

const updatedHtml = html.replace(/<div class="new-fleet-card mb30">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g, (match, inner) => {
    const btnRegex = /href="vehicle-detail\.html\?vehicle=([^"]+)"/;
    let name = '';
    const m = match.match(btnRegex);
    if(m) {
        name = m[1];
    } else {
        const altMatch = match.match(/alt="(.*?)"/);
        if (!altMatch) return match;
        name = encodeURIComponent(altMatch[1].trim());
    }
    
    // First, make sure we don't accidentally duplicate onclick if it exists (for safety)
    let finalMatch = match.replace(/onclick="[^"]*"/, "");
    
    // Add onclick
    return finalMatch.replace(/<div class="new-fleet-card mb30">/, `<div class="new-fleet-card mb30" onclick="window.location.href='vehicle-detail.html?vehicle=${name}'">`);
});

fs.writeFileSync(file, updatedHtml);
console.log('Successfully injected clickable surface area to massive fleet cards.');
