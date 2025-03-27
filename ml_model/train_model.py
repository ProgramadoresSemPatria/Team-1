import pandas as pd 

df = pd.read_csv('dataset/reduced_reviews.csv')

print (df.head())
print(df["Sentiment"].value_counts())


from sklearn.feature_extraction.text import CountVectorizer

vectorizer = CountVectorizer(max_features=5000)

X = vectorizer.fit_transform(df["Text"])

y = df["Sentiment"]