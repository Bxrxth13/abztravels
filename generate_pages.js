const fs = require('fs');

const placesData = {
    ooty: {
        title: "Ooty (Udhagamandalam)",
        tagline: "Queen of Hill Stations. Rolling tea gardens, breathtaking viewpoints, and cool mountain breezes.",
        aboutTitle: "Escape to the Hills",
        aboutDesc: "<p>Ooty, nestled in the Nilgiri hills, is a premier hill station celebrated for its picturesque landscapes, colonial heritage, and the historic Nilgiri Mountain Railway.</p><p>Vast tea estates and pristine botanical gardens provide a lush, serene escape that draws nature lovers all year round.</p>",
        dist: "85 km", time: "2.5-3 Hours",
        heroImg: "https://images.unsplash.com/photo-1598893114003-88981d3bc01b?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1626207038166-70e6c5bbad42?auto=format&fit=crop&q=80", t: "Tea Gardens", p:"Endless lush green hills."},
            {img: "https://images.unsplash.com/photo-1582223838275-cd337e6da48a?auto=format&fit=crop&q=80", t: "Ooty Lake", p:"Peaceful boating experience."},
            {img: "https://images.unsplash.com/photo-1590483860086-a681c2f1f07f?auto=format&fit=crop&q=80", t: "Botanical Wonders", p:"Rare flora and heritage trees."}
        ]
    },
    marudhamalai: {
        title: "Marudhamalai Temple",
        tagline: "Sacred Heritage. A profound spiritual retreat dedicated to Lord Murugan situated beautifully upon a hillock.",
        aboutTitle: "A Divine Journey",
        aboutDesc: "<p>Marudhamalai is an ancient 12th-century hill temple located on the Western Ghats, renowned for its serene atmosphere and spiritual significance.</p><p>Surrounded by dense forests containing medicinal herbs, the clean mountain air offers an elevating spiritual experience to thousands of devotees everyday.</p>",
        dist: "15 km", time: "1-2 Hours",
        heroImg: "https://images.unsplash.com/photo-1610414457787-8ea0b9ce4fbc?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1590050720489-32541f4810ea?auto=format&fit=crop&q=80", t: "Dravidian Art", p:"Stunning temple architecture."},
            {img: "https://images.unsplash.com/photo-1610414457787-8ea0b9ce4fbc?auto=format&fit=crop&q=80", t: "Hilltop Aura", p:"Beautiful panoramas."},
            {img: "https://images.unsplash.com/photo-1627443851508-2cbaae1ed58c?auto=format&fit=crop&q=80", t: "Sacred Steps", p:"A spiritual climb."}
        ]
    },
    siruvani: {
        title: "Siruvani Waterfalls",
        tagline: "Nature's Paradise. Crystal clear, incredibly sweet water cascading through deep Western Ghat forests.",
        aboutTitle: "Taste Incredible Waters",
        aboutDesc: "<p>The Siruvani river is world-renowned for the unique sweetness of its water. The magnificent waterfall forms deep inside the verdant Nilgiri Biosphere Reserve.</p><p>A trek through these dense, pristine forests provides the perfect rugged adventure, ending in a refreshing natural pool beloved by locals and tourists alike.</p>",
        dist: "35 km", time: "2-3 Hours",
        heroImg: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80", t: "Cascading Beauty", p:"The majestic main drop."},
            {img: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80", t: "Forest Trails", p:"Trek through dense canopy."},
            {img: "https://images.unsplash.com/photo-1504646736773-45c1a8bd5cb2?auto=format&fit=crop&q=80", t: "Natural Pools", p:"Serene clear waters."}
        ]
    },
    valparai: {
        title: "Valparai",
        tagline: "Lush Tea Estates. A bio-diverse paradise holding dozens of hairpin bends and massive evergreen forests.",
        aboutTitle: "An Untouched Hill Station",
        aboutDesc: "<p>Valparai is a pristine hill station standing at 3500 feet above sea level, famously surrounded by the Anamalai Tiger Reserve and vast expanse of tea and coffee plantations.</p><p>Unlike heavily commercialized spots, Valparai retains its raw, untouched beauty offering serene misty mornings and thrilling wildlife spotting opportunities.</p>",
        dist: "105 km", time: "3-4 Hours",
        heroImg: "https://images.unsplash.com/photo-1625805792945-31f4fc1424ed?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1625805792945-31f4fc1424ed?auto=format&fit=crop&q=80", t: "Endless Green", p:"Rolling tea plantations."},
            {img: "https://images.unsplash.com/photo-1621831776943-448f2a58baf0?auto=format&fit=crop&q=80", t: "Mist & Clouds", p:"Ethereal mornings."},
            {img: "https://images.unsplash.com/photo-1598893114003-88981d3bc01b?auto=format&fit=crop&q=80", t: "Hairpin Bends", p:"Thrilling scenic drives."}
        ]
    },
    perur: {
        title: "Perur Pateeswarar Temple",
        tagline: "Historical Architecture. An ancient Chola-built marvel depicting unparalleled stone carvings and sculptures.",
        aboutTitle: "Immersed in History",
        aboutDesc: "<p>Constructed by Karikala Chola in the 2nd century, the Perur Temple dedicated to Lord Shiva features the spectacular 'Kanaka Sabha' (Golden Hall) with exquisite stone carvings.</p><p>Every pillar tells deeply intricate stories of ancient mythology, making it not just a spiritual destination but a masterclass in ancient Dravidian heritage.</p>",
        dist: "9 km", time: "1-2 Hours",
        heroImg: "https://images.unsplash.com/photo-1600080336214-72213cf9a3e6?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1600080336214-72213cf9a3e6?auto=format&fit=crop&q=80", t: "Golden Hall", p:"Stunning Kanaka Sabha pillars."},
            {img: "https://images.unsplash.com/photo-1590050720489-32541f4810ea?auto=format&fit=crop&q=80", t: "Stone Carvings", p:"Intricate mythological art."},
            {img: "https://images.unsplash.com/photo-1610414457787-8ea0b9ce4fbc?auto=format&fit=crop&q=80", t: "Temple Pond", p:"Classical architecture."}
        ]
    },
    isha: {
        title: "Isha Yoga Center",
        tagline: "Inner Peace. A magnificent sacred space established for profound personal transformation.",
        aboutTitle: "Discover Inner Clarity",
        aboutDesc: "<p>The Isha Yoga Center is a spiritually powerful destination featuring the Dhyanalinga - a profound meditative space that doesn't ascribe to any particular belief system.</p><p>Visitors can also immerse themselves in the energized waters of the surya kund and chandra kund, providing deep mental and physical rejuvenation.</p>",
        dist: "30 km", time: "4-5 Hours",
        heroImg: "https://images.unsplash.com/photo-1602416049286-90f757d5494a?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1602416049286-90f757d5494a?auto=format&fit=crop&q=80", t: "Sacred Geometrics", p:"Incredible architectural domes."},
            {img: "images/places/adiyogi2.jpeg", t: "Adiyogi Proximity", p:"Right next to the famous statue."},
            {img: "https://images.unsplash.com/photo-1604085448655-08e1b10697d4?auto=format&fit=crop&q=80", t: "Tranquil Flow", p:"Lush peaceful environment."}
        ]
    },
    kodaikanal: {
        title: "Kodaikanal",
        tagline: "The Princess of Hill Stations. A breathtaking high-altitude sanctuary known for its star-shaped lake and pine forests.",
        aboutTitle: "Above the Clouds",
        aboutDesc: "<p>Set in an area of granite cliffs, forested valleys, lakes, and waterfalls, Kodaikanal centers around its man-made, star-shaped Kodai Lake.</p><p>Trek through dense Pine Forests, discover the thrilling Pillar Rocks, or simply enjoy homemade mountain chocolate while breathing in the incredibly crisp, cold air.</p>",
        dist: "170 km", time: "4-5 Hours",
        heroImg: "https://images.unsplash.com/photo-1582223838275-cd337e6da48a?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1582223838275-cd337e6da48a?auto=format&fit=crop&q=80", t: "Kodai Lake", p:"The heart of the town."},
            {img: "https://images.unsplash.com/photo-1594895085472-8874fa703fb7?auto=format&fit=crop&q=80", t: "Pine Forests", p:"Tall majestic woods."},
            {img: "https://images.unsplash.com/photo-1626207038166-70e6c5bbad42?auto=format&fit=crop&q=80", t: "Pillar Rocks", p:"Towering granite cliffs."}
        ]
    },
    blackthunder: {
        title: "Black Thunder",
        tagline: "Adventure & Thrills. Asia's No.1 water theme park situated beautifully at the foothills of Nilgiris.",
        aboutTitle: "Exhilarating Fun",
        aboutDesc: "<p>Black Thunder is a premier 75-acre water theme park offering dozens of thrilling rides, massive wave pools, and massive slides perfectly integrated into the natural landscape.</p><p>It serves as the ultimate family getaway. Beyond the wild water rides, it also features a massive dry-park, ensuring absolutely endless entertainment for all ages.</p>",
        dist: "40 km", time: "6-8 Hours",
        heroImg: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&q=80",
        gal: [
            {img: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&q=80", t: "Wave Pool", p:"Artificial beach experience."},
            {img: "https://images.unsplash.com/photo-1583344600109-1cdcb40d512a?auto=format&fit=crop&q=80", t: "Massive Slides", p:"Adrenaline rushing drops."},
            {img: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80", t: "Family Rides", p:"Endless group joy."}
        ]
    }
};

let template = fs.readFileSync('place-detail.html', 'utf8');

// Strip out the massive script section entirely so static files are clean!
template = template.replace(/<script>[\s\S]*?<\/script>/g, '');

for (const [key, data] of Object.entries(placesData)) {
    let output = template;

    // Use regular expressions to surgically inject the correct content into the template without requiring IDs
    output = output.replace(/<title>.*?<\/title>/, `<title>${data.title} - Famous Destinations | AUTOBOTZ</title>`);
    output = output.replace(/<h1 class="hero-title" id="dy-title">.*?<\/h1>/, `<h1 class="hero-title" id="dy-title">${data.title}</h1>`);
    output = output.replace(/<p class="hero-tagline" id="dy-tagline">.*?<\/p>/, `<p class="hero-tagline" id="dy-tagline">${data.tagline}</p>`);
    output = output.replace(/id="dy-hero-bg" src=".*?"/, `id="dy-hero-bg" src="${data.heroImg}"`);
    
    output = output.replace(/<h2 id="dy-about-title">.*?<\/h2>/, `<h2 id="dy-about-title">${data.aboutTitle}</h2>`);
    output = output.replace(/<div id="dy-about-desc">[\s\S]*?<\/div>/, `<div id="dy-about-desc">\n                    ${data.aboutDesc}\n                </div>`);
    output = output.replace(/<strong id="dy-dist">.*?<\/strong>/, `<strong id="dy-dist">${data.dist}</strong>`);
    output = output.replace(/<strong id="dy-time">.*?<\/strong>/, `<strong id="dy-time">${data.time}</strong>`);
    
    // Replace gallery images and text
    output = output.replace(/id="dy-about-img" src=".*?"/, `id="dy-about-img" src="${data.gal[0].img}"`);
    output = output.replace(/id="dy-gal-1" src=".*?"/, `id="dy-gal-1" src="${data.gal[0].img}"`);
    output = output.replace(/<h3 id="dy-gal-t1">.*?<\/h3>/, `<h3 id="dy-gal-t1">${data.gal[0].t}</h3>`);
    output = output.replace(/<p id="dy-gal-p1">.*?<\/p>/, `<p id="dy-gal-p1">${data.gal[0].p}</p>`);
    
    output = output.replace(/id="dy-gal-2" src=".*?"/, `id="dy-gal-2" src="${data.gal[1].img}"`);
    output = output.replace(/<h3 id="dy-gal-t2">.*?<\/h3>/, `<h3 id="dy-gal-t2">${data.gal[1].t}</h3>`);
    output = output.replace(/<p id="dy-gal-p2">.*?<\/p>/, `<p id="dy-gal-p2">${data.gal[1].p}</p>`);
    
    output = output.replace(/id="dy-gal-3" src=".*?"/, `id="dy-gal-3" src="${data.gal[2].img}"`);
    output = output.replace(/<h3 id="dy-gal-t3">.*?<\/h3>/, `<h3 id="dy-gal-t3">${data.gal[2].t}</h3>`);
    output = output.replace(/<p id="dy-gal-p3">.*?<\/p>/, `<p id="dy-gal-p3">${data.gal[2].p}</p>`);

    const splitTitle = data.title.split(' ')[0];
    output = output.replace(/<h2 id="dy-cta">.*?<\/h2>/, `<h2 id="dy-cta">Ready to explore ${splitTitle}?</h2>`);

    fs.writeFileSync(`${key}.html`, output);
    console.log(`Generated ${key}.html`);
}
