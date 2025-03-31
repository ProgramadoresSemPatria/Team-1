import pandas as pd 

df = pd.read_csv("dataset/Reviews.csv")

df = df[["Text",'Score']].dropna()

def map_score(score):
    if score <= 2:
        return 'negativo'
    elif score == 3:
        return 'neutro'
    else:
        return 'positivo'
    
df['Sentiment'] = df['Score'].apply(map_score)    

df_reduced = pd.concat([
    df[df['Sentiment'] == 'positivo'].sample(n=40000,),
    df[df['Sentiment'] == 'negativo'].sample(n=40000),
    df[df['Sentiment'] == 'neutro'].sample(n=40000)
])

df_reduced.to_csv('dataset/reduced_reviews.csv',index = False)


print(df[['Text', 'Score', 'Sentiment']].head(10))
print(df_reduced['Sentiment'].value_counts())