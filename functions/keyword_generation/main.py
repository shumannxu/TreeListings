import os

# The Firebase Admin SDK to access Cloud Firestore.
from google.cloud import firestore
from google.events.cloud import firestore as firestoredata
from cloudevents.http import CloudEvent
import functions_framework

import contractions
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List
import google.generativeai as genai
import nltk

nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

client = firestore.Client()


"""
This file is responsible for generating key words pertaining to a listing, based on listing title, desc, and categories.
The keywords generated may or may not be part of the title or description (more often not). 

TODO: To use this file, make sure to input the google_api_key by:
>>> export GOOGLE_API_KEY=<api_key which I will send personally>

TODO: To use this file, scroll down and refer to the "find_key_words" function. 

TODO: To use this file, make sure that you download all of the packages below (e.g. contractions, nltk, etc)

TODO: To do a test run using mock data, scroll down and uncomment "EXAMPLE_USAGE()" 

"""
# GEMINI API KEY
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# gemini pro model
model = genai.GenerativeModel("gemini-pro")

stopwords = stopwords.words("english")
lemmatizer = WordNetLemmatizer()


def combine_title_desc_categories(title: str, desc: str, categories: List[str]) -> str:
    combined_str = title + ". " + desc + ". " + ",".join(categories)
    return combined_str


def remove_stopwords(words: List[str]):
    """Remove stop words from list of tokenized words"""
    new_words = []
    for word in words:
        if word not in stopwords:
            new_words.append(word)
    return new_words


def lemmatize_list(words: List[str]):
    """Lemmatization is the process of grouping together the different inflected forms of a word so they can be analyzed as a single item."""
    new_words = []
    for word in words:
        new_words.append(
            lemmatizer.lemmatize(word, pos="v")
        )  # Ex: Lemma for studies is study and Lemma for studying is studying.
    return new_words


def clean_text(title_desc_categories_str):
    # conduct contraction
    cleaned_contractions = word_tokenize(contractions.fix(title_desc_categories_str))
    # lowercase all words
    words_lowered = [w.lower() for w in cleaned_contractions]
    # removed punctuation
    words_no_punc = []
    for word in words_lowered:
        new_word = re.sub(r"[^\w\s]", "", word)
        if new_word != "":
            words_no_punc.append(new_word)

    # remove stop words
    cleaned_words = remove_stopwords(words_no_punc)
    # lemmatize
    lemmatized = lemmatize_list(cleaned_words)
    return " ".join(lemmatized)


def rank_keywords(cleaned_text: str):
    # Initialize the TF-IDF vectorizer
    vectorizer = TfidfVectorizer()
    # Fit and transform the text
    tfidf_matrix = vectorizer.fit_transform([cleaned_text])
    # Get feature names
    feature_names = vectorizer.get_feature_names_out()  # Get TF-IDF scores
    tfidf_scores = tfidf_matrix.toarray()[0]
    # Zip feature names and TF-IDF scores
    keyword_scores = zip(feature_names, tfidf_scores)
    # Sort keywords by TF-IDF score in descending order
    sorted_keywords = sorted(keyword_scores, key=lambda x: x[1], reverse=True)
    return sorted_keywords[:]


"""

MAIN FUNCTION 

Parameters: 
title -> listing's title
desc -> listing's description
categories -> listing's categories
num_key_words -> number of key words to generate

Returns: List[str] that contains num_key_words of key words pertaining to the listing. The generated keywords may or may 
not be from the title or description (more likely that the keywords are NOT included in the title or description
for purposes of acquiring better search results.)

The function utilizes cleans text, finds relevant words through normalization, ranks the keyword by 
importance according to TF-IDF, and filters and re-generate relevant key words of the listing via 
prompting to gemini-pro. There may be extremely small chance that the returned list will be empty (but in my 
100th times of running, this  has not occurred so far.)

"""


def find_key_words(
    title: str, desc: str, categories: List[str], num_key_words: int = 5
) -> List[str]:
    # preprocessing
    combined_str = combine_title_desc_categories(title, desc, categories)
    cleaned_text = clean_text(combined_str)
    # all keywords and scores
    keywords_scores_list = rank_keywords(cleaned_text)
    # join keywords
    keywords = [keyword for keyword, value in keywords_scores_list[:10]]
    # print(keywords)

    # prompt to gemini pro
    # prompt = "'" + ','.join(keywords) + "'." + "The preceding texts were the description of a product or a service on a listing on an e-commerce website. Generate " + str(num_key_words) + " key words, where each is max 2 words long, that are most relevant keywords that describe this product or service OR most relevant keywords that describe the category or genre that this product or service strongly relates to. Please respond in the format provided after this sentence. KEY; [xxxx, xxxx, xxxxx, xxxx, xxxxx, xxx, xxx, xxx, xxx, xxx]"
    prompt = (
        "'"
        + ",".join(keywords)
        + "'."
        + "The preceding texts were the description of a product or a service with the title,"
        + title
        + ", posted on a listing on an e-commerce website. Generate "
        + str(num_key_words)
        + " key words, where each is max 2 words long, that are most relevant keywords that describe this product or service OR most relevant keywords that describe the category or genre that this product or service strongly relates to. The generated keywords should not be a direct match with any words in the title. Please respond in the format provided after this sentence. KEY; [xxxx, xxxx, xxxxx, xxxx, xxxxx, xxx, xxx, xxx, xxx, xxx]"
    )

    # gemini's fixed output pattern
    pattern = r"^KEY; \[[\w\s,]+\]$"
    # number of tries attempted to prompt gemini (as very ocassionaly gemini responds in diff. format)
    tries = 0

    response_text = "KEY; []"
    # break the loop if (1) gemini outputted in the desired format or (2) gemini could not output in the desired format in 3 tries
    while True:
        # prompt gemini
        response = model.generate_content(prompt)
        if re.match(pattern, response.text):
            response_text = response.text
            break
        tries += 1
        # print("TRYING")
        # Max tries of 4 times (So far, max tries I've observed are 4)
        if tries >= 7:
            break

    # Split the response string by semicolon to separate the key and the list of keywords
    key, keywords_str = response_text.split(";")
    # Strip any leading or trailing whitespace from the keywords string and remove the square brackets
    keywords_str = keywords_str.strip()[1:-1]
    # Split the keywords string by comma and strip any leading or trailing whitespace from each keyword
    keywords_list = [word.strip().lower() for word in keywords_str.split(",")][
        :num_key_words
    ]

    print("\nTitle:", title, "\nGenerated Keywords: ", keywords_list, "\n")

    return keywords_list


"""
THIS FUNCITON IS FOR TESTING & DEMO PURPOSES ONLY

Run this function to see how the above main function works using mock data
"""


def EXAMPLE_USAGE():
    """Example data, strucured as: [ (title, desc, [category1, category2,...]) , ...]"""
    EXAMPLES = [
        (
            "Apple iPhone 11 Max 256GB - Excellent Condition!",
            "Up for sale is my trusted Apple iPhone 11 Max with 256GB storage capacity. This smartphone is in excellent condition, meticulously cared for, and fully functional. It comes with a stunning 6.5-inch Super Retina XDR display, delivering vibrant colors and crisp images. The battery health is still impressive, ensuring long hours of uninterrupted usage. Whether you're capturing precious memories with its advanced camera system or enjoying seamless performance with its powerful A13 Bionic chip, this iPhone 11 Max is sure to exceed your expectations. Don't miss out on this opportunity to own a premium device at a great price!",
            ["Electronics"],
        ),
        (
            "Stanford Hat (Black)",
            "Used, tennis cap. Perfect for a sunny day. Also perfect for sports.",
            ["Apparel", "Sporting Goods"],
        ),
        (
            "Powerful Gaming Laptop: ASUS ROG Strix Scar 15",
            "Elevate your gaming experience with the ASUS ROG Strix Scar 15 gaming laptop. Packed with high-performance components, this laptop is built to deliver uncompromising gaming performance. Featuring an Intel Core i9 processor and NVIDIA GeForce RTX 3080 graphics, you'll enjoy smooth gameplay with stunning visuals. The 15.6-inch Full HD display boasts a fast refresh rate and ultra-low response time, ensuring you never miss a moment of the action. With ample storage and lightning-fast SSD, you can store your entire game library and enjoy lightning-fast load times. Plus, the customizable RGB keyboard adds a touch of style to your gaming setup. Whether you're conquering the latest AAA titles or streaming your favorite games, the ASUS ROG Strix Scar 15 is your ultimate gaming companion. Get ready to dominate the battlefield and achieve victory in style!",
            ["Electronics"],
        ),
        (
            "Small Heater",
            "Can adjust the strength of heat and can also act as a mini fan. Used for about 1 year, perfect condition",
            ["Electronics", "Office Supplies", "Home Goods"],
        ),
        (
            "Black Pearl Necklace",
            "Not used and real black pearl from Gifu, Japan",
            "Apparel,",
        ),
        ("stuffed animals", "stuffed animals used", "Toys & Games,"),
        ("Bed mattress", "new condition, soft and comfy", ["Home Goods"]),
        (
            "Math Tutoring",
            "Tutoring for anyone for up to 5 hours per week on math",
            ["Services"],
        ),
        (
            "Leasing Room in EVGR",
            "Leasing one-room single on the 4th floor of EVGR. The room comes with a bathroom and a kitchen.",
            ["Property Rentals"],
        ),
    ]
    # running main function
    for i in range(len(EXAMPLES)):
        (title, desc, categories) = EXAMPLES[i]
        num_keywords_to_generate = 5
        keywords_list = find_key_words(
            title, desc, categories, num_keywords_to_generate
        )


@functions_framework.cloud_event
def keyword_generation(
    event: CloudEvent,
) -> None:
    """Listens for new documents to be added to /messages. If the document has
    an "original" field, creates an "uppercase" field containg the contents of
    "original" in upper case."""

    # firestore_payload = firestoredata.DocumentEventData()
    # firestore_payload._pb.ParseFromString(cloud_event.data)

    # path_parts = firestore_payload.value.name.split("/")
    # separator_idx = path_parts.index("documents")
    # collection_path = path_parts[separator_idx + 1]
    # document_path = "/".join(path_parts[(separator_idx + 2) :])

    # print(f"Collection path: {collection_path}")
    # print(f"Document path: {document_path}")

    # affected_doc = client.collection(collection_path).document(document_path)
    # doc_snapshot = event.get("value")
    # if doc_snapshot:
    #     doc_data = doc_snapshot.get("fields", {})
    #     title = doc_data.get("title", {}).get("stringValue", "")
    #     desc = doc_data.get("description", {}).get("stringValue", "")
    #     categories = doc_data.get("categories", {}).get("arrayValue", {}).get("values", [])
    #     categories = [category.get("stringValue", "") for category in categories]
    # else:
    #     title, desc, categories = "", "", []

    try:
        firestore_payload = firestoredata.DocumentEventData()
        firestore_payload._pb.ParseFromString(event.data)

        path_parts = firestore_payload.value.name.split("/")
        separator_idx = path_parts.index("documents")
        collection_path = path_parts[separator_idx + 1]
        document_path = "/".join(path_parts[(separator_idx + 2) :])

        print(f"Collection path: {collection_path}")
        print(f"Document path: {document_path}")

        affected_doc = client.collection(collection_path).document(document_path)

        title = firestore_payload.value.fields["title"].string_value.strip()
        description = firestore_payload.value.fields["description"].string_value.strip()
        categories = firestore_payload.value.fields["categories"].array_value.values
        categories = [category.string_value for category in categories]
        keywords = find_key_words(title, description, categories)

        # Update the document with keywords while preserving other fields
        affected_doc.update({"keywords": firestore.ArrayUnion(keywords)})
    except KeyError as e:
        print(f"KeyError encountered: {e}. Please check the document structure.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def main():
    EXAMPLE_USAGE()


# Using the special variable
# __name__
if __name__ == "__main__":
    main()
