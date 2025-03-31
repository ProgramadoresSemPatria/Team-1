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
import unicodedata 




corrections = {
    "loove": "love",
    "loveed": "loved",
    "soo": "so",
    "okaay": "okay",
    "wwbuythiscom": "buy",
    "idk": "i dont know"
}
stop_words = set(stopwords.words('english'))

def clear_text(text):
    text = text.lower()
    text = unicodedata.normalize("NFKD",text).encode('ascii','ignore').decode('utf-8','ignore')
    text = re.sub(r'(.)\1{2,}', r'\1\1', text)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\bbr\b', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    word =wordpunct_tokenize(text)
    filtered_word = [p for p in word if p not in stop_words]
    return ' '.join(filtered_word)



def get_most_common_words_table(df,sentiment_label, n=10):
    texts = df[df["Sentiment"] == sentiment_label]['Text'],
    all_words = ' '.join(texts).split()
    word_counts = Counter(all_words).most_common(n)
    
    if word_counts:
        return pd.DataFrame(word_counts,columns=["Word", 'Frequency'])
    else:
        return pd.DataFrame(columns=['Word','Frequency'])
    


