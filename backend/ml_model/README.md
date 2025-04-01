# AI - Sentiment Analysis Module

## Summary
- [Objective](#objective)
- [Project Structure](#project-structure)
- [Preprocessing](#preprocessing)
- [Model Training](#model-training)
- [Prediction API](#prediction-api)
- [Usage Example](#usage-example)
- [Future Features](#future-features)
- [Requirements](#requirements)

---

## Objective
Develop an AI module to automatically classify text feedback into three categories:
- **Positive**
- **Negative**
- **Neutral**

The model is integrated with an API that allows practical classification of CSV files containing text.

---

## Project Structure
```
ml_model/
├── dataset/
│   ├── Reviews.csv              # Original (not included in the repository)
│   └── reduced_reviews.csv      # Balanced dataset
├── model/
│   ├── modelo_sentimento.pkl    # Trained model
│   └── vectorizer.pkl           # TF-IDF vectorizer
├── preprocess.py                # clear_text() function
└── train_model.py               # Training pipeline
```

---

## Preprocessing
The `preprocess.py` file contains the `clear_text()` function, which performs:
- Conversion to lowercase
- Removal of stopwords
- Removal of URLs, emojis, repetitions, and common errors
- Normalization of words with spelling errors

The `Reviews.csv` base is transformed via ETL into `reduced_reviews.csv`, balancing 42,000 examples per class (positive, negative, and neutral).

---

## Model Training
The `train_model.py` file executes:
- Vectorization via `TfidfVectorizer`
- Training with `LinearSVC(dual=False)`
- Evaluation with `classification_report`

### Results
```
Accuracy: ~0.72
F1-score:
 - Positive: 0.79
 - Negative: 0.73
 - Neutral:   0.64
```

The model and vector are persisted as `.pkl` in `ml_model/model/`.

---

## Prediction API
The AI module is integrated with a Flask API. The active route is:

```
POST /predict-csv
```

### Input Parameters
- `.csv` file with a `Text` column containing the feedback.

### Response
```json
[
  {
    "Text": "awesome product",
    "Sentiment_Prediction": "positive"
  },
  ...
]
```

---

## Usage Example
Via Postman:
1. Select `POST` method
2. Endpoint: `http://localhost:5000/predict-csv`
3. Send `.csv` file with `Text` field
4. Receive JSON with predictions

---

## Future Features
- [ ] Integration with generative AI for automatic insights and summaries
- [ ] Creation of automatic responses based on sentiment
- [ ] Export of automated reports for users

---

## Requirements
- Python 3.10+
- `scikit-learn`
- `pandas`
- `nltk`
- `flask`
- `joblib`
