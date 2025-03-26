import pandas as pd 

df = pd.read_csv("dataset/reduced_reviews.csv")

print(df[['Text', 'Score', 'Sentiment']].head(10))
print(df['Sentiment'].value_counts())