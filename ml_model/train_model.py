import pandas as pd 

df = pd.read_csv('dataset/reduced_reviews.csv')

print (df.head())
print(df["Sentiment"].value_counts())