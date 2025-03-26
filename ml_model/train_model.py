import pandas as pd 
import nltk 
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tokenize import wordpunct_tokenize
nltk.download('stopwords')
nltk.download('punkt')

df = pd.read_csv("dataset/reduced_reviews.csv")

stop_words = set(stopwords.words('english'))

def clear_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    word =wordpunct_tokenize(text)
    filtered_word = [p for p in word if p not in stop_words]
    return ' '.join(filtered_word)

df['Text'] = df ['Text'].apply(clear_text)


print(df.head())
 