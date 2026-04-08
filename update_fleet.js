const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');

// We want to replace everything inside:
// <div id="items-carousel" class="owl-carousel wow fadeIn">
// up to the closing </div> of section-cars, but let's just use a clear boundary.

const startIndex = html.indexOf('<div id="items-carousel" class="owl-carousel wow fadeIn">');
const endIndex = html.indexOf('</div>\n                    </div>\n                </div>\n            </section>', startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find carousel block");
    process.exit(1);
}

const carouselHtml = html.substring(startIndex, endIndex);

// Regular expression to match each vehicle element
const itemRegex = /<div class="col-lg-12">\s*<div class="de-item mb30">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

const prices = {
    'Toyato Innova': '3000',
    'XUV 500': '3500',
    'Xcent': '2000',
    'Wagon R': '1500',
    'Tiago': '1500',
    'Santro': '1200',
    'Safari': '4000',
    'Ertiga': '2500',
    'Dzire': '1800',
    'Amaze': '1800',
    'Force Urbania': '8000',
    'Tata Winger': '5000',
    'Traveller 26 Seater': '10000',
    'Traveller 17 Seater': '8000',
    'Traveller 12 Seater': '6000'
};

const newCarouselHtml = carouselHtml.replace(/<div class="col-lg-12">\s*<div class="de-item mb30">[\s\S]*?<\/div>(\s*<\/div>){2}/g, (match) => {
    const nameMatch = match.match(/<h4>(.*?)<\/h4>/);
    const imgMatch = match.match(/<img src="(.*?)"/);
    const countMatch = match.match(/<span class="d-atr"><img src="images\/icons\/1-green\.svg"[^>]*>([^<]+)<\/span>/);
    
    if (!nameMatch || !imgMatch) {
       console.log("Could not parse a block:", match.substring(0,100));
       return match;
    }
    
    let name = nameMatch[1].trim();
    let img = imgMatch[1];
    let people = countMatch ? countMatch[1].trim() : '5';
    let price = prices[name] || '2000';
    let fullName = name + " Rental in Coimbatore";
    
    return `<div class="col-lg-12">
                                <div class="new-fleet-card mb30" onclick="window.location.href='vehicle-detail.html?vehicle=${encodeURIComponent(name)}'">
                                    <div class="fc-img-wrapper">
                                        <img src="${img}" class="img-fluid" alt="${name}">
                                    </div>
                                    <div class="fc-content">
                                        <div class="fc-stars">
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                        </div>
                                        <h4 class="fc-title">${fullName}</h4>
                                        <div class="fc-price">
                                            <span class="fc-amount">₹ ${price}</span><span class="fc-period">/ Day</span>
                                        </div>
                                        <div class="fc-features">
                                            <div class="fc-feature">
                                                <i class="fa-solid fa-user-group" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">${people} People</span>
                                            </div>
                                            <div class="fc-feature">
                                                <i class="fa fa-star" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">Yes</span>
                                            </div>
                                            <div class="fc-feature">
                                                <i class="fa-regular fa-window-maximize" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">Yes</span>
                                            </div>
                                        </div>
                                        <a class="fc-btn" href="vehicle-detail.html?vehicle=${encodeURIComponent(name)}">Rent Now</a>
                                    </div>
                                </div>
                            </div>`;
});

const finalHtml = html.substring(0, startIndex) + newCarouselHtml + html.substring(endIndex);

fs.writeFileSync(file, finalHtml);
console.log("Replaced vehicles content successfully!");

