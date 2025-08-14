# 📧 Spam Email Detector – FastAPI + Chrome Extension

This project is a **machine learning-based spam detection system** for emails, trained using TensorFlow and deployed via **FastAPI**.  
It also includes a **Chrome Extension** that automatically checks Gmail messages for spam in real time.

---

## 🚀 Features
- **ML Model** trained with Tokenizer + Embedding layer
- **FastAPI Backend** serving predictions
- **Chrome Extension** for Gmail
- **Popup Interface** for manual text checking
- CORS-enabled API for local and extension communication

---

## 📂 Project Structure
```
Spam_email/
│── spam_api/
│ ├── app.py # FastAPI backend
│ ├── spam_tf_model.keras # Trained ML model
│ ├── tokenizer.pkl # Tokenizer from training
│ ├── requirements.txt # Python dependencies
│
│── chrome_extension/
│ ├── manifest.json
│ ├── content.js
│ ├── popup.js
│ ├── popup.html
│ ├── images/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
│
│── README.md
│── .gitignore

```


## 🛠 Setup & Installation

### **1. Clone Repository**
```bash
git clone https://github.com/YOUR-USERNAME/Spam-Email-Detector.git
cd Spam-Email-Detector/spam_api
```
2. Create Virtual Environment
```python -m venv venv```


Activate it:

Windows (PowerShell):

```venv\Scripts\activate```


Mac/Linux:

```source venv/bin/activate```

3. Install Dependencies
```pip install -r requirements.txt```

▶ Run FastAPI Server
```uvicorn app:app --reload```


Server runs at: http://127.0.0.1:8000

Test health endpoint:

http://127.0.0.1:8000/health

🧪 Test the API

Example Python test:
```
import requests

res = requests.post("http://127.0.0.1:8000/predict", json={
    "message": "Congratulations! You have won $1000."
})
print(res.json())
```
🌐 Setup Chrome Extension

Open Chrome → chrome://extensions

Enable Developer mode (top-right).

Click Load unpacked.

Select the chrome_extension/ folder from this repo.

Open Gmail → Click an email → The extension will alert spam/ham status.
## 📷 Screenshots

### **1️⃣ Model Summary**
![Model Summary](screenshots/model_summary.png)

### **2️⃣ Accuracy & Confusion Matrix**
![Accuracy and Confusion Matrix](screenshots/accuracy_confusion_matrix.png)

### **3️⃣ API Test in Insomnia**
![Insomnia API Test](screenshots/insomnia_api_test.png)

### **4️⃣ Chrome Extension – Manual Email Check**
![Extension Popup](screenshots/enter_email_spam_detect.png)

### **5️⃣ Chrome Extension – Gmail Spam Alert**
![Gmail Spam Alert](screenshots/gmail_spam_alert.png)



📌 Notes

Model & Tokenizer provided are trained on the SMS Spam Collection dataset.

Gmail DOM structure may change over time, requiring updates to content.js selectors.

The API must be running locally for the extension to work unless deployed online.

📜 License

This project is licensed under the MIT License.


