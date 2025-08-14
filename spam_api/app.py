from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from fastapi.middleware.cors import CORSMiddleware
import logging
import re

# ===== CONFIG =====
MODEL_PATH = "spam_tf_model.keras"
TOKENIZER_PATH = "tokenizer.pkl"
MAX_LEN = 10  # Must match training

# ===== LOGGING =====
logging.basicConfig(level=logging.INFO)

# ===== TEXT CLEANING FUNCTION =====
def clean_text(text: str) -> str:
    """
    Lowercase, remove non-alphanumeric characters except spaces.
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return text.strip()

# ===== LOAD MODEL & TOKENIZER =====
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(TOKENIZER_PATH, "rb") as f:
        tokenizer = pickle.load(f)
    logging.info("✅ Model and tokenizer loaded successfully.")
    logging.info(f"Tokenizer vocab size: {len(tokenizer.word_index)}")
    logging.info(f"MAX_LEN: {MAX_LEN}")
except Exception:
    logging.exception("❌ Failed to load model or tokenizer.")
    raise

# ===== FASTAPI APP =====
app = FastAPI()

# ✅ Enable CORS for Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, allow all. Restrict later for security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== REQUEST BODY =====
class Message(BaseModel):
    message: str

# ===== ROUTES =====
@app.get("/")
def home():
    return {"message": "Spam Detection API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(data: Message):
    try:
        # Clean text like during training
        cleaned_message = clean_text(data.message)

        # Convert to sequence
        seq = tokenizer.texts_to_sequences([cleaned_message])

        # If no recognizable tokens found
        if not any(seq[0]):
            return {
                "prediction": "unknown",
                "probability_spam": None,
                "probability_ham": None,
                "error": "No recognizable words for the model."
            }

        # Pad and predict
        padded = pad_sequences(seq, maxlen=MAX_LEN, padding="post")
        prediction = float(model.predict(padded)[0][0])

        # Check for NaN
        if prediction != prediction:  # NaN check
            return {
                "prediction": "error",
                "probability_spam": None,
                "probability_ham": None,
                "error": "Model returned NaN."
            }

        # Determine label
        label = "spam" if prediction > 0.5 else "ham"

        return {
            "prediction": label,
            "probability_spam": prediction,
            "probability_ham": 1 - prediction
        }

    except Exception as e:
        logging.exception("Prediction error")
        return {"error": str(e)}
