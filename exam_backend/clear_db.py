from database import questions_collection, db

if __name__ == "__main__":
    result = questions_collection.delete_many({})
    print(f"Cleared {result.deleted_count} questions from the database.")
    
    # Also clear mock results for cleaner testing
    mock_res = db["mock_results"].delete_many({})
    print(f"Cleared {mock_res.deleted_count} mock results from the database.")
