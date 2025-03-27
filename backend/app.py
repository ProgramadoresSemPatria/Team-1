from flask import Flask, request, jsonify
import pandas as pd
import joblib
from ml_model.preprocess import clear_text


app = Flask(__name__)

model = joblib.load('ml_model/ml_model/model/modelo_sentimento.pkl')
vectorizer = joblib.load('ml_model/ml_model/model/vectorizer.pkl')

