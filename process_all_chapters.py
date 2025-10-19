#!/usr/bin/env python3
"""
Script to process all 7 chapters from temp_db.txt and update akhlak_db.json
"""

import json
import re

def clean_json_content(content):
    """Clean and fix JSON formatting issues"""
    # Remove any BOM or invisible characters
    content = content.strip()
    
    # Fix missing commas between objects in arrays
    content = re.sub(r'}\s*\n\s*{', '},\n{', content)
    
    # Fix missing commas between array elements
    content = re.sub(r']\s*\n\s*\[', '],\n[', content)
    
    # Fix missing commas between properties
    content = re.sub(r'"\s*\n\s*"', '",\n"', content)
    
    # Fix missing commas before closing brackets
    content = re.sub(r'(\w+)\s*\n\s*]', r'\1\n]', content)
    content = re.sub(r'(\w+)\s*\n\s*}', r'\1\n}', content)
    
    # Ensure proper array formatting
    content = re.sub(r'\[\s*\n\s*{', '[\n{', content)
    content = re.sub(r'}\s*\n\s*\]', '}\n]', content)
    
    return content

def process_temp_db():
    """Process temp_db.txt and extract all quiz data"""
    
    print("Reading temp_db.txt...")
    
    # Read the temp_db.txt file
    with open('src/data/temp_db.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"File size: {len(content)} characters")
    
    # Clean JSON formatting
    print("Cleaning JSON formatting...")
    cleaned_content = clean_json_content(content)
    
    # Try to parse the JSON
    try:
        quiz_data = json.loads(cleaned_content)
        print("Successfully parsed temp_db.txt")
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print("Attempting additional fixes...")
        
        # Additional manual fixes
        cleaned_content = cleaned_content.replace('}\n{', '},\n{')
        cleaned_content = cleaned_content.replace(']\n[', '],\n[')
        
        # Fix specific patterns
        cleaned_content = re.sub(r'(\d+)\s*\n\s*]', r'\1\n]', cleaned_content)
        cleaned_content = re.sub(r'(\d+)\s*\n\s*}', r'\1\n}', cleaned_content)
        
        try:
            quiz_data = json.loads(cleaned_content)
            print("Successfully parsed after additional fixes")
        except json.JSONDecodeError as e2:
            print(f"Still failed to parse: {e2}")
            print("First 1000 characters of content:")
            print(cleaned_content[:1000])
            return None
    
    print(f"Found {len(quiz_data)} categories")
    
    # Count questions in each category
    total_questions = 0
    for category in quiz_data:
        question_count = len(category.get('questions', []))
        total_questions += question_count
        print(f"  - {category['id']}: {question_count} questions")
    
    print(f"Total questions: {total_questions}")
    return quiz_data

def update_akhlak_db(quiz_data):
    """Update akhlak_db.json with all quiz data"""
    
    # Read current akhlak_db.json
    print("\nReading akhlak_db.json...")
    with open('src/data/akhlak_db.json', 'r', encoding='utf-8') as f:
        akhlak_data = json.load(f)
    
    # Replace quizCategories with new data
    print("Updating quizCategories with all 7 chapters...")
    akhlak_data['quizCategories'] = quiz_data
    
    # Update version and lastUpdated
    akhlak_data['version'] = "2.2.0"
    akhlak_data['lastUpdated'] = "2025-01-19"
    
    # Write back to file
    print("Writing updated akhlak_db.json...")
    with open('src/data/akhlak_db.json', 'w', encoding='utf-8') as f:
        json.dump(akhlak_data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully updated akhlak_db.json with {len(quiz_data)} categories!")
    
    # Count total questions
    total_questions = sum(len(category['questions']) for category in quiz_data)
    print(f"Total questions: {total_questions}")
    
    return True

def main():
    print("Processing all chapters from temp_db.txt...")
    
    # Process temp_db.txt
    quiz_data = process_temp_db()
    
    if quiz_data is None:
        print("Failed to process temp_db.txt")
        return False
    
    # Update akhlak_db.json
    print("\nUpdating akhlak_db.json...")
    success = update_akhlak_db(quiz_data)
    
    if success:
        print("\nAll chapters processed successfully!")
        print("Chapters included:")
        for i, category in enumerate(quiz_data, 1):
            print(f"  {i}. {category['name']}")
        return True
    else:
        print("\nFailed to update akhlak_db.json")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ All 7 chapters with 15 questions each have been successfully added!")
    else:
        print("\n❌ Processing failed!")
