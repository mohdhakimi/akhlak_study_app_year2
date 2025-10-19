import json

# Read the new questions
with open('new_questions.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

with open('chapters_3_4_5_6_7_questions.json', 'r', encoding='utf-8') as f:
    additional_questions = json.load(f)

# Read the current database
with open('src/data/akhlak_db.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# Replace questions for each topic
question_mapping = {
    'adab-makan-minum': new_questions['adab-makan-minum'],
    'adab-tidur': new_questions['adab-tidur'],
    'adab-berkenderaan': additional_questions['adab-berkenderaan'],
    'adab-di-masjid': additional_questions['adab-di-masjid'],
    'adab-belajar': additional_questions['adab-belajar'],
    'adab-dengan-al-quran': additional_questions['adab-dengan-al-quran'],
    'adab-memelihara-harta-awam': additional_questions['adab-memelihara-harta-awam']
}

# Update the database
for topic in database['topics']:
    topic_id = topic['id']
    if topic_id in question_mapping:
        # Find the quiz category and update questions
        for quiz_category in database['quizCategories']:
            if quiz_category['id'] == topic_id:
                quiz_category['questions'] = question_mapping[topic_id]
                break

# Write the updated database
with open('src/data/akhlak_db.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, ensure_ascii=False, indent=2)

print("Questions updated successfully!")
