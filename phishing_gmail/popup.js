const API_URL = "http://127.0.0.1:8000/predict";

document.getElementById('checkSpam').addEventListener('click', async () => {
    const emailText = document.getElementById('emailText').value.trim();
    const resultDiv = document.getElementById('result');
    const btn = document.getElementById('checkSpam');

    if (!emailText) {
        resultDiv.innerText = "⚠ Please paste some text first.";
        resultDiv.style.color = "orange";
        return;
    }

    btn.disabled = true;
    resultDiv.innerText = "⏳ Checking...";
    resultDiv.style.color = "blue";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: emailText })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        if (data.prediction) {
            resultDiv.innerText = `Prediction: ${data.prediction.toUpperCase()} 
(Spam Probability: ${(data.probability_spam * 100).toFixed(2)}%)`;
            resultDiv.style.color = data.prediction === "spam" ? "red" : "green";
        } else if (data.error) {
            resultDiv.innerText = `Error: ${data.error}`;
            resultDiv.style.color = "red";
        }
    } catch (error) {
        resultDiv.innerText = `Error: ${error.message}`;
        resultDiv.style.color = "red";
    } finally {
        btn.disabled = false;
    }
});
