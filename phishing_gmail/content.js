// ==== CONFIG ====
const API_URL = "http://127.0.0.1:8000/predict";

// Track last checked email to avoid duplicate checks
let lastCheckedEmailId = null;

// Extract email body text from Gmail
function getEmailText() {
    let emailBodyElement = document.querySelector(".a3s.aiL") 
                         || document.querySelector(".a3s"); // fallback selector
    return emailBodyElement ? emailBodyElement.innerText.trim() : "";
}

// Check email for spam
function checkEmailForSpam() {
    // Extract email ID from URL
    const emailIdMatch = window.location.hash.match(/#inbox\/([^/]+)/);
    if (!emailIdMatch) return;

    const currentEmailId = emailIdMatch[1];
    if (currentEmailId === lastCheckedEmailId) return; // already checked
    lastCheckedEmailId = currentEmailId;

    const emailText = getEmailText();
    if (!emailText) return;

    console.log("Extracted Email Text:", emailText);

    // Send to prediction API
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: emailText })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Prediction:", data);
        if (data.prediction) {
            alert(`Prediction: ${data.prediction}\nSpam Probability: ${(data.probability_spam * 100).toFixed(2)}%`);
        } else if (data.error) {
            alert(`Error: ${data.error}`);
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Spam detection failed: API may be offline.");
    });
}

// Observe Gmail content changes
const observer = new MutationObserver(() => {
    if (window.location.hash.includes("#inbox/")) {
        setTimeout(checkEmailForSpam, 1500); // wait for DOM to load
    }
});

observer.observe(document.body, { childList: true, subtree: true });
