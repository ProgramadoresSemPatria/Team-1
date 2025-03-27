import pandas as pd 
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report


df = pd.read_csv('dataset/reduced_reviews.csv')

print (df.head())
print(df["Sentiment"].value_counts())


from sklearn.feature_extraction.text import CountVectorizer

vectorizer = CountVectorizer(max_features=5000)

X = vectorizer.fit_transform(df["Text"])

y = df["Sentiment"]


X_train, X_test , y_train, y_test = train_test_split(
    X, y, test_size= 0.3, random_state=42
)