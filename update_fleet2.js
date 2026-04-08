const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');

const startIndex = html.indexOf('<div id="items-carousel"');
const searchString = '</div>\n                    </div>\n                </div>\n            </section>';
const endIndex = html.indexOf(searchString, startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find carousel block");
    process.exit(1);
}

const carouselHtml = html.substring(startIndex, endIndex);

// Using a very strict regex that captures exactly the content until the final two closing divs, because the next block will start with <div class="col-lg-12"> if it's another item.
// Wait, safer to split by '<div class="col-lg-12">'

const pieces = carouselHtml.split('<div class="col-lg-12">');

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

const newPieces = pieces.map((piece, index) => {
    if (index === 0) return piece; // The part before the first <div class="col-lg-12">
    
    // Each piece has the content of ONE vehicle, ending with the extra newlines/spaces before the next one or the end
    const nameMatch = piece.match(/<h4>(.*?)<\/h4>/);
    const imgMatch = piece.match(/<img src="(.*?)"/);
    const countMatch = piece.match(/<span class="d-atr"><img src="images\/icons\/1-green\.svg"[^>]*>([^<]+)<\/span>/);
    
    if (!nameMatch || !imgMatch) {
       return '<div class="col-lg-12">' + piece;
    }
    
    let name = nameMatch[1].trim();
    let img = imgMatch[1];
    let people = countMatch ? countMatch[1].trim() : '5';
    let price = prices[name] || '2000';
    let fullName = name + " Rental in Coimbatore";
    
    const cardHtml = `
                                <div class="new-fleet-card mb30">
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
                                                <i class="fa fa-user" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">${people} People</span>
                                            </div>
                                            <div class="fc-feature">
                                                <i class="fa fa-star" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">Yes</span>
                                            </div>
                                            <div class="fc-feature">
                                                <i class="fa fa-suitcase" style="color:#ff3333; font-size:16px;"></i>
                                                <span style="font-weight: 500; font-size: 15px;">Yes</span>
                                            </div>
                                        </div>
                                        <a class="fc-btn" href="#new-booking-section">Rent Now</a>
                                    </div>
                                </div>
                            </div>
`;
    // We append the closing div of col-lg-12 which we split on
    return '<div class="col-lg-12">' + cardHtml;
});

const newCarouselHtml = newPieces.join('');

const finalHtml = html.substring(0, startIndex) + newCarouselHtml + html.substring(endIndex);

fs.writeFileSync(file, finalHtml);
console.log("Replaced vehicles content successfully!");
