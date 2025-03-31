import pandas as pd 
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.feature_extraction.text import CountVectorizer
import joblib
import os 
from sklearn.svm import LinearSVC
df = pd.read_csv('dataset/reduced_reviews.csv')

vectorizer = CountVectorizer(max_features=5000)

X = vectorizer.fit_transform(df["Text"])

y = df["Sentiment"]

X_train, X_test , y_train, y_test = train_test_split(
    X, y, test_size= 0.3, random_state=42
)

model = LinearSVC(dual=False)
model.fit(X_train,y_train)

y_pred = model.predict(X_test)

print("classification report:")
print (classification_report(y_test,y_pred))


os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/modelo_sentimento.pkl")

joblib.dump(vectorizer, "model/vectorizer.pkl")

print("modelo salvo")