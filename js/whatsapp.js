function sendToWhatsapp(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let number = "+918122666644";

    let carTypeElement = document.querySelector('input[name="Car_Type"]:checked');
    let pickupLocation = document.getElementById('autocomplete').value;
    let dropoffLocation = document.getElementById('autocomplete2').value;
    let phoneNumber = document.getElementById('phone-number').value;
    let pickupDate = document.getElementById('date-picker').value;
    let pickupTime = document.getElementById('pickup-time').value;
    let returnDate = document.getElementById('date-picker-2').value;
    let returnTime = document.getElementById('collection-time').value;

    // Validation
    if (!carTypeElement || !pickupLocation || !dropoffLocation || !phoneNumber || !pickupDate || !pickupTime || !returnDate || !returnTime) {
        alert("Please fill in all the required fields.");
        return;
    }

    let carType = carTypeElement.value;

    // Construct the URL with added topics and footer
    var message = encodeURIComponent(
        `*ENQUIRE FROM ABz WEBSITE*\n\n\n\n` +
        `*Vehicle Type:* _${carType}_\n\n` +
        `*Pickup Location:* _${pickupLocation}_\n\n` +
        `*Dropoff Location:* _${dropoffLocation}_\n\n` +
        `*Phone Number:* _${phoneNumber}_\n\n` +
        `*Pickup Date:* _${pickupDate}_\n` +
        `*Return Date:* _${returnDate}_\n` +
        '*_Powered by ABz Travels_*'
    );

    var url = `https://wa.me/${number}?text=${message}`;

    // Open WhatsApp link in a new tab
    window.open(url, '_blank');
}
