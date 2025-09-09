from flask import Flask, render_template, request, jsonify
import joblib
import os
import numpy as np
from flask_cors import CORS
import pandas as pd

import os

# Get the absolute path to the current directory
base_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, 
            template_folder=os.path.join(base_dir, 'app', 'templates'),
            static_folder=os.path.join(base_dir, 'app', 'static'),
            static_url_path='/static')
CORS(app)

# Ensure the app knows where to find static files
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching for development
app.config['PREFERRED_URL_SCHEME'] = 'http'

# Load models and data
models = {}
dish_nutrition = {}
dish_names = []

# Load data from CSV
def load_data():
    global dish_nutrition, dish_names
    df = pd.read_csv('Indian_Food_Nutrition_Processed.csv')
    
    # Create a mapping of dish names to their nutritional values
    dish_nutrition = {}
    for _, row in df.iterrows():
        dish_nutrition[row['Dish Name']] = row.drop('Dish Name').to_dict()
    
    # Get unique dish names
    dish_names = df['Dish Name'].unique().tolist()
    
    # Save the mapping and dish names for future use
    os.makedirs('models', exist_ok=True)
    joblib.dump(dish_nutrition, 'models/dish_nutrition_mapping.joblib')
    joblib.dump(dish_names, 'models/dish_names.joblib')
    
    return dish_nutrition, dish_names

# Load data when the app starts
dish_nutrition, dish_names = load_data()

@app.route('/dish-names')
def get_dish_names():
    return jsonify(dish_names)

# Load data when the app starts
if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
def home():
    try:
        # Debug information
        print("Current working directory:", os.getcwd())
        print("Template folder:", app.template_folder)
        print("Static folder:", app.static_folder)
        
        # Verify template exists
        template_path = os.path.join(app.template_folder, 'index.html')
        print("Looking for template at:", template_path)
        print("Template exists:", os.path.exists(template_path))
        
        return render_template('index.html', dish_names=dish_names)
    except Exception as e:
        import traceback
        error_msg = f"Error rendering template: {str(e)}\n\n{traceback.format_exc()}"
        print(error_msg)
        return error_msg, 500

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    dish_name = data.get('dish_name')
    
    if not dish_name or dish_name not in dish_nutrition:
        return jsonify({'error': 'Dish not found'}), 404
    
    # Get nutritional information
    nutrition = dish_nutrition[dish_name]
    
    return jsonify({
        'dish_name': dish_name,
        'nutrition': nutrition
    })

@app.route('/generate_plan', methods=['POST'])
def generate_plan():
    data = request.get_json()
    weight = float(data.get('weight', 70))  # Default to 70kg
    height = float(data.get('height', 170))  # Default to 170cm
    age = int(data.get('age', 30))  # Default to 30 years
    gender = data.get('gender', 'male').lower()
    activity_level = data.get('activity_level', 'moderate').lower()
    goal = data.get('goal', 'maintain').lower()
    
    # Calculate BMR (Basal Metabolic Rate)
    if gender == 'male':
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    
    # Adjust for activity level
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    tdee = bmr * activity_multipliers.get(activity_level, 1.55)
    
    # Adjust for goal
    if goal == 'lose':
        tdee -= 500  # 500 calorie deficit for weight loss
    elif goal == 'gain':
        tdee += 500  # 500 calorie surplus for weight gain
    
    # Generate a sample meal plan (simplified example)
    meal_plan = {
        'breakfast': {
            'dish': 'Oatmeal with fruits',
            'calories': tdee * 0.25  # 25% of daily calories
        },
        'lunch': {
            'dish': 'Chicken rice bowl with vegetables',
            'calories': tdee * 0.35  # 35% of daily calories
        },
        'snack': {
            'dish': 'Greek yogurt with nuts',
            'calories': tdee * 0.1  # 10% of daily calories
        },
        'dinner': {
            'dish': 'Grilled fish with quinoa and vegetables',
            'calories': tdee * 0.3  # 30% of daily calories
        }
    }
    
    return jsonify({
        'bmr': round(bmr, 2),
        'tdee': round(tdee, 2),
        'meal_plan': meal_plan
    })

if __name__ == '__main__':
    app.run(debug=True)
