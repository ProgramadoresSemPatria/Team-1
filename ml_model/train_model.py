import pandas as pd 
import nltk 
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


df = pd.read_csv("dataset/reduced_reviews.csv")