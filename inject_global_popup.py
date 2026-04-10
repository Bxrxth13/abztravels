import os
import re

popup_snippet = """
<!-- GLOBAL FLOATING REVIEW WIDGET -->
<style>
.float-review { position: fixed; bottom: 30px; left: 30px; transform: translateX(-150%); opacity: 0; z-index: 9999; background: rgba(17,17,17,0.92); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-left: 4px solid #cb1515; border-radius: 12px; padding: 20px 25px; width: 340px; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.4); transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s; pointer-events: none; }
.float-review.show { transform: translateX(0); opacity: 1; pointer-events: auto; }
.fr-close { position: absolute; top: 15px; right: 15px; font-size: 1.1rem; color: #888; cursor: pointer; transition: 0.2s; }
.fr-close:hover { color: white; }
.fr-stars { color: #fbbc04; font-size: 0.9rem; margin-bottom: 8px; }
.fr-text { font-size: 0.95rem; font-weight: 500; font-style: italic; margin-bottom: 8px; color: #e5e7eb; }
.fr-author { font-size: 0.85rem; color: #9ca3af; font-weight: 600; }
@media(max-width:768px){ .float-review{ left: 15px; right: 15px; width: auto; bottom: 20px; } }
</style>
<div class="float-review" id="globalFloatReview">
    <i class="fa fa-times fr-close" onclick="closeGlobalFloatReview()"></i>
    <div class="fr-stars"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div>
    <div class="fr-text" id="gfr-text">“Excellent service & smooth trip!”</div>
    <div class="fr-author">— <span id="gfr-author">Barani Kumar</span></div>
</div>
<script>
    const gFloatData = [
        { text: "“Had an excellent experience with autobotz travel service. Highly recommended!”", author: "Mäggïe Möön" },
        { text: "“Manoj, our driver, was extremely kind, patient, and professional.”", author: "Barani Kumar" },
        { text: "“Neat, clean and comfortable. Friendly and responsible driver.”", author: "Beena Shankar" },
        { text: "“The vehicle was clean, the driver polite, trip was comfortable and safe.”", author: "SHREENITHI D" },
        { text: "“Excellent vehicle and professional driver. Overall very good experience.”", author: "Vigadam.com" }
    ];
    let gFloatEl, gFrText, gFrAuthor;
    let gFloatActive = true;
    
    document.addEventListener("DOMContentLoaded", () => {
        gFloatEl = document.getElementById('globalFloatReview');
        gFrText = document.getElementById('gfr-text');
        gFrAuthor = document.getElementById('gfr-author');
        
        setTimeout(popGlobalFloatReview, 1000);
        setInterval(popGlobalFloatReview, 4000); // Trigger every 4 seconds (2s visible + 2s hidden)
    });

    function popGlobalFloatReview() {
        if(!gFloatActive) return;
        const r = gFloatData[Math.floor(Math.random() * gFloatData.length)];
        gFrText.innerText = r.text;
        gFrAuthor.innerText = r.author;
        
        gFloatEl.classList.add('show');
        
        setTimeout(() => {
            if(gFloatEl.classList.contains('show')) gFloatEl.classList.remove('show');
        }, 2000); // Close gently after 2 seconds
    }

    function closeGlobalFloatReview() {
        gFloatEl.classList.remove('show');
        gFloatActive = false; 
        setTimeout(() => gFloatActive = true, 30000);
    }
</script>
"""

directory = "./"
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        path = os.path.join(directory, filename)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        if filename == "index.html" or "GLOBAL FLOATING REVIEW WIDGET" in content:
            continue

            
        # Optional: remove the specific local widget from index.html if it's there
        if filename == "index.html" and "<!-- FLOATING REVIEW WIDGET -->" in content:
            content = re.sub(r'/\* FLOATING NOTIFICATION \*/.*?</style>', '</style>', content, flags=re.DOTALL)
            content = re.sub(r'<!-- FLOATING REVIEW WIDGET -->.*?</script>', '', content, flags=re.DOTALL)
            # wait, the regex stripping might be fragile due to the mixed carousel script, let me just ignore index.html auto stripping and instead only inject to non-index files, or manually fix index.
        
        if "</body>" in content:
            # inject right before body closes
            content = content.replace("</body>", popup_snippet + "\n</body>")
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Injected into {filename}")
