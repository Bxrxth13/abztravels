const fs = require('fs');
const templateStr = fs.readFileSync('kodaikanal.html', 'utf8');

const places = [
    {
        file: 'aliyardam.html',
        title: 'Aliyar Dam',
        tag: 'Coimbatore, Tamil Nadu',
        tagline: 'A scenic reservoir nestled in the foothills of Valparai, perfect for boating and picnics.',
        aboutTitle: 'Tranquil Reservoir',
        aboutDesc: '<p>A stunning reservoir located at the foothills of Valparai in the Anaimalai range.</p><p>Surrounded by mountains on three sides, offering a serene environment for boating, magnificent park walks, and peaceful picnics with family.</p>',
        dist: '65 km',
        time: '1-2 Hours',
        image: 'aliyar_dam.png',
        high1Icon: 'fa-ship', high1Title: 'Boating', high1Desc: 'Enjoy paddle boating around the large reservoir with mountain slopes in the backdrop.',
        high2Icon: 'fa-tree', high2Title: 'Dam Park', high2Desc: 'A well-maintained park and aquarium perfect for families.',
        high3Icon: 'fa-mountain', high3Title: 'Valparai Foothills', high3Desc: 'Experience the scenic Western Ghats standing tall directly behind the beautiful dam.',
        query: 'dam,reservoir,nature'
    },
    {
        file: 'topslip.html',
        title: 'Topslip',
        tag: 'Coimbatore, Tamil Nadu',
        tagline: 'Located in the Anamalai Tiger Reserve, known for elephant safaris and pristine dense forests.',
        aboutTitle: 'Into the Wild',
        aboutDesc: '<p>Topslip is a magnificent slice of the Western Ghats located inside the Anamalai Tiger Reserve.</p><p>It is famously known for elephant camps, dense forest safaris, and preserving an incredibly rich biodiversity of flora and fauna.</p>',
        dist: '75 km',
        time: '3-4 Hours',
        image: 'topslip.png',
        high1Icon: 'fa-elephant', high1Title: 'Elephant Safari', high1Desc: 'A thrilling ride through the deep jungle guided by expert forest guards.',
        high2Icon: 'fa-leaf', high2Title: 'Jungle Trekking', high2Desc: 'Walk through the towering dense trees taking part in deep nature walks.',
        high3Icon: 'fa-paw', high3Title: 'Wildlife Watching', high3Desc: 'Spot exotic birds, deer, and maybe even a tiger roaming the Anamalai range.',
        query: 'forest,jungle,safari'
    },
    {
        file: 'coonoor.html',
        title: 'Coonoor',
        tag: 'Nilgiris, Tamil Nadu',
        tagline: 'Famous for its production of Nilgiri tea, Coonoor offers sweeping views of the lush tea estates and the Heritage Train.',
        aboutTitle: 'The Tea Capital',
        aboutDesc: '<p>Coonoor is the second largest hill station in the Nilgiri hills, known for its sprawling tea estates.</p><p>A noticeably quieter town compared to Ooty, offering a perfectly relaxing atmosphere among the misty hills and old colonial bungalows.</p>',
        dist: '70 km',
        time: '4-5 Hours',
        image: 'coonoor.png',
        high1Icon: 'fa-leaf', high1Title: 'Tea Gardens', high1Desc: 'Take a walk inside incredibly lush green slopes that produce the famous Nilgiri Tea.',
        high2Icon: 'fa-train', high2Title: 'Nilgiri Mountain Railway', high2Desc: 'Take the iconic toy train offering unforgettable views of the valleys.',
        high3Icon: 'fa-binoculars', high3Title: 'Sims Park', high3Desc: 'Explore beautiful botanical gardens housing numerous exotic plant species.',
        query: 'tea,nilgiris,hills'
    },
    {
        file: 'munnar.html',
        title: 'Munnar',
        tag: 'Idukki, Kerala',
        tagline: 'Kerala’s most iconic hill station, marked by sprawling tea plantations, winding roads, and misty mountain tops.',
        aboutTitle: 'Misty Mountains',
        aboutDesc: '<p>Munnar rises as three mountain streams merge—Mudrapuzha, Nallathanni and Kundala.</p><p>Known as the Kashmir of South India, it’s characterized by unending expanses of tea plantations, pristine valleys, and mountains covered in clouds.</p>',
        dist: '160 km',
        time: '5-6 Hours',
        image: 'munnar.png',
        high1Icon: 'fa-leaf', high1Title: 'Tea Estates', high1Desc: 'Endless carpets of green tea bushes rolling over vibrant hills.',
        high2Icon: 'fa-water', high2Title: 'Cascading Waterfalls', high2Desc: 'Visit majestic roaring falls like Attukal and Cheeyappara.',
        high3Icon: 'fa-camera', high3Title: 'Echo Point', high3Desc: 'A picturesque location where natural sounds resonate across the valley.',
        query: 'munnar,hills,tea'
    },
    {
        file: 'varkala.html',
        title: 'Varkala',
        tag: 'Trivandrum, Kerala',
        tagline: 'A unique coastal town in Kerala where red laterite cliffs plunge directly into the Arabian Sea.',
        aboutTitle: 'The Cliff Beach',
        aboutDesc: '<p>Varkala is the only place in southern Kerala where towering cliffs are found adjacent to the Arabian Sea.</p><p>These majestic Cenozoic sedimentary formation cliffs drop sharply into pristine waters, dotted with aesthetic cafes and spiritual spots.</p>',
        dist: '300 km',
        time: 'Full Day',
        image: 'varkala.png',
        high1Icon: 'fa-water', high1Title: 'Papanasam Beach', high1Desc: 'A beautiful beach backed by magnificent cliffs and natural springs.',
        high2Icon: 'fa-coffee', high2Title: 'Cliff Cafes', high2Desc: 'Enjoy delicious seafood and incredible sunsets at the cliff-edge cafes.',
        high3Icon: 'fa-wind', high3Title: 'Surfing & Yoga', high3Desc: 'A perfect hub for digital nomads seeking waves and inner peace.',
        query: 'varkala,beach,cliffs'
    },
    {
        file: 'tirupati.html',
        title: 'Tirupati',
        tag: 'Chittoor, Andhra Pradesh',
        tagline: 'One of the holiest Hindu pilgrimage sites, home to the majestic Sri Venkateswara Temple on the Tirumala Hills.',
        aboutTitle: 'Divine Pilgrimage',
        aboutDesc: '<p>Tirupati is a major pilgrimage and cultural city in the Rayalaseema region of Andhra.</p><p>Surrounded by the holy Seshachalam Hills, it features intricate Dravidian architecture and draws millions of devotees worldwide for absolute blessings.</p>',
        dist: '450 km',
        time: '1-2 Days',
        image: 'tirupati.png',
        high1Icon: 'fa-om', high1Title: 'Sri Venkateswara Temple', high1Desc: 'The incredibly wealthy and culturally monumental hilltop temple.',
        high2Icon: 'fa-archway', high2Title: 'Dravidian Architecture', high2Desc: 'Exceptional ancient carvings, golden vimanas, and huge gopurams.',
        high3Icon: 'fa-mountain', high3Title: 'Tirumala Hills', high3Desc: 'A lush green hill range with spiritual pathways to the divine.',
        query: 'temple,hindu,india'
    },
    {
        file: 'alleppey.html',
        title: 'Alleppey',
        tag: 'Alappuzha, Kerala',
        tagline: 'Venice of the East, famous for its grand houseboat cruises taking you through the serene Kerala Backwaters.',
        aboutTitle: 'Backwater Serenity',
        aboutDesc: '<p>Alleppey is best known for houseboat cruises along the rustic Kerala backwaters.</p><p>A network of tranquil canals, lagoons, and elegant houseboats that smoothly float past paddy fields and tiny village settlements.</p>',
        dist: '240 km',
        time: 'Full Day',
        image: 'alleppey.png',
        high1Icon: 'fa-ship', high1Title: 'Houseboat Cruise', high1Desc: 'Float along the serene backwaters in a traditional premium Kettuvallam.',
        high2Icon: 'fa-water', high2Title: 'Vembanad Lake', high2Desc: 'The longest lake in India, deeply majestic with incredible biodiversity.',
        high3Icon: 'fa-tree', high3Title: 'Paddy Fields', high3Desc: 'Vibrant green agricultural fields operating below sea level.',
        query: 'kerala,backwaters,boat'
    },
    {
        file: 'mysore.html',
        title: 'Mysore',
        tag: 'Karnataka, India',
        tagline: 'A city of royal heritage, featuring the spectacular illumination of the Mysore Palace and rich cultural history.',
        aboutTitle: 'Royal Heritage',
        aboutDesc: '<p>Mysore is the cultural capital of Karnataka, serving historically as times of the Wodeyar dynasty.</p><p>The city is famous globally for its grand incredibly ornate palaces, premium silk sarees, yoga heritage, and the spectacular Dasara festival.</p>',
        dist: '200 km',
        time: 'Full Day',
        image: 'mysore.png',
        high1Icon: 'fa-chess-rook', high1Title: 'Mysore Palace', high1Desc: 'Incredibly radiant palace illuminated by thousands of bulbs.',
        high2Icon: 'fa-om', high2Title: 'Chamundi Hills', high2Desc: 'Climb the traditional stone steps to visit the majestic temple at the top.',
        high3Icon: 'fa-leaf', high3Title: 'Brindavan Gardens', high3Desc: 'Extensive terrace gardens featuring magical musical fountains.',
        query: 'mysore,palace,india'
    },
    {
        file: 'pondicherry.html',
        title: 'Pondicherry',
        tag: 'Puducherry, India',
        tagline: 'A beautiful blend of French colonial architecture and Indian culture, offering quiet beaches and vibrant streets.',
        aboutTitle: 'French Riviera',
        aboutDesc: '<p>Pondicherry beautifully retains its French colonial heritage with gorgeous tree-lined streets, mustard-yellow villas, and chic boutiques.</p><p>The aesthetic town offers a rare and beautiful blend of spiritual tranquility at Auroville alongside laid-back coastal aesthetics.</p>',
        dist: '380 km',
        time: 'Full Day',
        image: 'pondicherry.png',
        high1Icon: 'fa-building', high1Title: 'White Town', high1Desc: 'Walk past aesthetic vintage French colonial villas wrapped in bougainvillea.',
        high2Icon: 'fa-water', high2Title: 'Promenade Beach', high2Desc: 'A relaxing long coastal stretch flanked by historical statues.',
        high3Icon: 'fa-om', high3Title: 'Auroville', high3Desc: 'An experimental spiritual township focused on human unity and peace.',
        query: 'pondicherry,colonial,aesthetic'
    },
    {
        file: 'gokarna.html',
        title: 'Gokarna',
        tag: 'Uttara Kannada, Karnataka',
        tagline: 'A temple town famous for its pristine beaches like Om Beach, blending spiritual tranquility with a tropical vibe.',
        aboutTitle: 'Tropical Spirituality',
        aboutDesc: '<p>Gokarna is traditionally a Hindu pilgrimage town that has transformed into a beach lover paradise.</p><p>It features ruggedly beautiful beaches, incredible trekking routes over coastal cliffs, and a uniquely rustic bohemian energy.</p>',
        dist: '720 km',
        time: '2-3 Days',
        image: 'gokarna.png',
        high1Icon: 'fa-water', high1Title: 'Om Beach', high1Desc: 'A majestic beach naturally shaped like the auspicious Om symbol.',
        high2Icon: 'fa-route', high2Title: 'Beach Trekking', high2Desc: 'Magnificent trails connecting Paradise, Half-Moon, and Kudle beach.',
        high3Icon: 'fa-om', high3Title: 'Mahabaleshwar Temple', high3Desc: 'Explore historic deep rooted culture inside ancient temple complexes.',
        query: 'gokarna,beach,sea'
    },
    {
        file: 'kanyakumari.html',
        title: 'Kanyakumari',
        tag: 'Tamil Nadu, India',
        tagline: 'The southernmost tip of the Indian peninsula where three vibrant oceans meet.',
        aboutTitle: 'The Southern Tip',
        aboutDesc: '<p>Kanyakumari sits at the absolute geographical tip of the Indian subcontinent.</p><p>It famously hosts the confluence of the Arabian Sea, the Bay of Bengal, and the Indian Ocean, offering magnificent simultaneous sunsets and moonrises.</p>',
        dist: '430 km',
        time: '1-2 Days',
        image: 'kanyakumari.png',
        high1Icon: 'fa-sun', high1Title: 'Sunrise Spectacle', high1Desc: 'Unmatched sunrise views rising directly over the intersection of three oceans.',
        high2Icon: 'fa-monument', high2Title: 'Vivekananda Rock', high2Desc: 'A grand spiritual monument isolated beautifully in the roaring sea.',
        high3Icon: 'fa-torii-gate', high3Title: 'Thiruvalluvar Statue', high3Desc: 'An impressive 133-foot stone statue dedicated to the famous poet.',
        query: 'kanyakumari,ocean,sunrise'
    }
];

places.forEach(place => {
    let output = templateStr;
    
    // Replace Meta Titles
    output = output.replace(/<title>.*?<\/title>/, \`<title>\${place.title} - Famous Destinations | AUTOBOTZ</title>\`);
    
    // Replace Hero Bg
    output = output.replace(/src="images\/places\/kodaikanal1.png"/g, \`src="images/places/\${place.image}"\`);
    
    // Replace Tag, Title, Tagline
    output = output.replace(/<span class="hero-tag">.*?<\/span>/, \`<span class="hero-tag"><i class="fa fa-map-marker-alt" style="margin-right: 8px;"></i> \${place.tag}</span>\`);
    output = output.replace(/<h1 class="hero-title" id="dy-title">.*?<\/h1>/, \`<h1 class="hero-title" id="dy-title">\${place.title}</h1>\`);
    output = output.replace(/<p class="hero-tagline" id="dy-tagline">.*?<\/p>/, \`<p class="hero-tagline" id="dy-tagline">\${place.tagline}</p>\`);
    
    // Replace About Text
    output = output.replace(/<h2 id="dy-about-title">.*?<\/h2>/, \`<h2 id="dy-about-title">\${place.aboutTitle}</h2>\`);
    output = output.replace(/<div id="dy-about-desc">.*?<\/div>/s, \`<div id="dy-about-desc">\${place.aboutDesc}</div>\`);
    
    // Replace Stats
    output = output.replace(/<strong id="dy-dist">.*?<\/strong>/, \`<strong id="dy-dist">\${place.dist}</strong>\`);
    output = output.replace(/<strong id="dy-time">.*?<\/strong>/, \`<strong id="dy-time">\${place.time}</strong>\`);
    
    // Replace About Image
    output = output.replace(/src="images\/places\/kodaikanal2.png"/g, \`src="https://loremflickr.com/800/600/\${place.query.split(',')[0]}?random=9"\`);
    output = output.replace(/alt="Kodaikanal Pine Forest"/g, \`alt="\${place.title} View"\`);

    // Replace Highlights
    let highlightHtml = \`
                <div class="highlight-item">
                    <div class="highlight-icon"><i class="fa-solid \${place.high1Icon}"></i></div>
                    <h3>\${place.high1Title}</h3>
                    <p>\${place.high1Desc}</p>
                </div>
                
                <div class="highlight-item">
                    <div class="highlight-icon"><i class="fa-solid \${place.high2Icon}"></i></div>
                    <h3>\${place.high2Title}</h3>
                    <p>\${place.high2Desc}</p>
                </div>
                
                <div class="highlight-item">
                    <div class="highlight-icon"><i class="fa-solid \${place.high3Icon}"></i></div>
                    <h3>\${place.high3Title}</h3>
                    <p>\${place.high3Desc}</p>
                </div>\`;
    output = output.replace(/<div class="highlights-grid">.*?<\/section>/s, \`<div class="highlights-grid">\${highlightHtml}</div></div></section>\`);

    // Replace Gallery
    let galleryHtml = \`
        <div class="gallery-grid">
            <div class="gallery-item">
                <img src="images/places/\${place.image}" alt="\${place.title}">
                <div class="gallery-caption">
                    <h3>\${place.title} Panorama</h3>
                    <p>Beautiful scenic view.</p>
                </div>
            </div>
            <div class="gallery-item">
                <img src="https://loremflickr.com/600/400/\${place.query.split(',')[0]}?random=1" alt="\${place.title} Snapshot">
                <div class="gallery-caption">
                    <h3>Aesthetic View</h3>
                    <p>Captivating perspective.</p>
                </div>
            </div>
            <div class="gallery-item">
                <img src="https://loremflickr.com/600/400/\${place.query.split(',')[0]}?random=2" alt="\${place.title} Detail">
                <div class="gallery-caption">
                    <h3>Local Heritage</h3>
                    <p>Rich culture and terrain.</p>
                </div>
            </div>
        </div>\`;
    output = output.replace(/<div class="gallery-grid">.*?<\/div>\s*<!-- WHY CHOOSE US -->/s, \`\${galleryHtml}\n\n        <!-- WHY CHOOSE US -->\`);

    // Replace CTA
    output = output.replace(/<h2 id="dy-cta">.*?<\/h2>/, \`<h2 id="dy-cta">Ready to explore \${place.title}?</h2>\`);

    fs.writeFileSync(place.file, output);
    console.log('Generated ' + place.file);
});
