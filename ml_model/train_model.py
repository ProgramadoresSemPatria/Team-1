import pandas as pd 
import nltk 
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tokenize import wordpunct_tokenize
nltk.download('stopwords')
nltk.download('punkt')
import matplotlib.pyplot as plt 
from collections import Counter

df = pd.read_csv("dataset/reduced_reviews.csv")

stop_words = set(stopwords.words('english'))

def clear_text(text):
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\bbr\b', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    word =wordpunct_tokenize(text)
    filtered_word = [p for p in word if p not in stop_words]
    return ' '.join(filtered_word)

df['Text'] = df ['Text'].apply(clear_text)

def get_most_common_words_table(df,sentiment_label, n=10):
    texts = df[df["Sentiment"] == sentiment_label]['Text']
    all_words = ' '.join(texts).split()
    word_counts = Counter(all_words).most_common(n)
    
    if word_counts:
        return pd.DataFrame(word_counts,columns=["Word", 'Frequency'])
    else:
        return pd.DataFrame(columns=['Word','Frequency'])
    


print(get_most_common_words_table(df, 'positivo'))


print(get_most_common_words_table(df, 'negativo'))


print(get_most_common_words_table(df, 'neutro'))

