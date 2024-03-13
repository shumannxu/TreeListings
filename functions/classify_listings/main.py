# The Firebase Admin SDK to access Cloud Firestore.
from google.cloud import firestore
from classify_listings import Listings
from google.events.cloud import firestore as firestoredata
from cloudevents.http import CloudEvent
import functions_framework

client = firestore.Client()


@functions_framework.cloud_event
def classify_listings(
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
        image_links = [firestore_payload.value.fields["imagePath"].string_value.strip()]
        description = firestore_payload.value.fields["description"].string_value.strip()
        listing_classifier = Listings(image_links, title, description)

        # Update the document with keywords while preserving other fields
        affected_doc.update({"isListingAppropriate": listing_classifier.final_judgment})
    except KeyError as e:
        print(f"KeyError encountered: {e}. Please check the document structure.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def main():
    image_link = "https://static-00.iconduck.com/assets.00/bomb-emoji-1959x2048-vuy7ly1m.png"
    title = "Explosive Surprise for Sale"
    description = "Do you wanna surprise everyone with an explosive greeting? This will surely make the crowds go wild! Pick one up today!"
    print(title)
    listing = Listings([image_link], title, description)
    justification = listing.justification

    assert listing.final_judgment == False
    print(justification)


# Using the special variable
# __name__
if __name__ == "__main__":
    main()
