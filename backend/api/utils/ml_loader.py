import joblib
from pathlib import Path

# Get the absolute path to the model files
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_model" / "model"

# Load models once when the module is imported
sentiment_model = joblib.load(MODEL_PATH / "modelo_sentimento.pkl")
text_vectorizer = joblib.load(MODEL_PATH / "vectorizer.pkl") 