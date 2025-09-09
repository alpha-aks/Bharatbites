import pandas as pd
import numpy as np
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
import joblib
import os
import warnings

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
warnings.filterwarnings('ignore')

def preprocess_text(text):
    """Preprocess dish names for better feature extraction"""
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-z\s]', '', text)
    
    # Tokenize and remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in word_tokenize(text) if word not in stop_words]
    
    return ' '.join(tokens)

def extract_ingredients_and_style(dish_name):
    """Extract potential ingredients and cooking styles from dish names"""
    # Common ingredients and cooking styles in Indian cuisine
    ingredients = ['chicken', 'paneer', 'potato', 'rice', 'dal', 'chana', 'rajma', 
                  'mushroom', 'egg', 'fish', 'mutton', 'prawn', 'spinach', 'lentil',
                  'chickpea', 'cauliflower', 'potato', 'tomato', 'onion', 'garlic',
                  'ginger', 'cheese', 'yogurt', 'curd', 'coconut', 'peas', 'carrot',
                  'capsicum', 'beans', 'okra', 'eggplant', 'pumpkin', 'bitter', 'sweet']
    
    styles = ['curry', 'fry', 'fried', 'roast', 'grill', 'tandoori', 'masala',
             'biryani', 'pulao', 'soup', 'stew', 'gravy', 'dry', 'stir', 'steam',
             'boil', 'bake', 'steam', 'kebab', 'tikka', 'pakora', 'samosa', 'dosa',
             'idli', 'vada', 'puri', 'paratha', 'naan', 'roti']
    
    dish_name = dish_name.lower()
    
    # Check for ingredients and styles
    dish_ingredients = [ing for ing in ingredients if ing in dish_name]
    dish_styles = [style for style in styles if style in dish_name]
    
    return {
        'ingredient_count': len(dish_ingredients),
        'style_count': len(dish_styles),
        'has_meat': any(meat in dish_name for meat in ['chicken', 'mutton', 'fish', 'prawn']),
        'is_vegetarian': not any(meat in dish_name for meat in ['chicken', 'mutton', 'fish', 'prawn', 'egg']),
        'is_spicy': any(spice in dish_name for spice in ['masala', 'chilli', 'spicy', 'hot']),
        'is_sweet': any(sweet in dish_name for sweet in ['sweet', 'halwa', 'kheer', 'barfi'])
    }

def load_and_preprocess_data(filepath):
    # Load the dataset
    df = pd.read_csv(filepath)
    
    # Basic data cleaning
    df = df.drop_duplicates(subset=['Dish Name'])
    
    # Create a mapping of dish names to their nutritional values
    dish_to_nutrition = {}
    for idx, row in df.iterrows():
        dish_to_nutrition[row['Dish Name']] = row.drop('Dish Name').to_dict()
    
    # Save the mapping for later use
    os.makedirs('models', exist_ok=True)
    joblib.dump(dish_to_nutrition, 'models/dish_nutrition_mapping.joblib')
    
    # Extract features from dish names
    df['processed_name'] = df['Dish Name'].apply(preprocess_text)
    
    # Extract additional features
    features = []
    for name in df['Dish Name']:
        features.append(extract_ingredients_and_style(name))
    
    feature_df = pd.DataFrame(features)
    
    # Combine features
    X = pd.concat([
        df[['Dish Name', 'processed_name']],
        feature_df
    ], axis=1)
    
    # Target variables
    y = df.drop(['Dish Name', 'processed_name'], axis=1, errors='ignore')
    
    # Save the list of dish names for the frontend
    joblib.dump(df['Dish Name'].unique().tolist(), 'models/dish_names.joblib')
    
    return X, y, df['Dish Name']

def create_model_pipeline():
    """Create a pipeline for preprocessing and modeling"""
    # Text features processing
    text_transformer = Pipeline(steps=[
        ('tfidf', TfidfVectorizer(max_features=100, ngram_range=(1, 2)))
    ])
    
    # Numerical features processing
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', MinMaxScaler())
    ])
    
    # Combine all features
    preprocessor = ColumnTransformer(
        transformers=[
            ('text', text_transformer, 'processed_name'),
            ('num', numeric_transformer, ['ingredient_count', 'style_count']),
            ('cat', 'passthrough', ['has_meat', 'is_vegetarian', 'is_spicy', 'is_sweet'])
        ])
    
    # Create pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', GradientBoostingRegressor(random_state=42))
    ])
    
    return pipeline

def evaluate_model(y_true, y_pred, nutrient_name):
    """Calculate and print evaluation metrics"""
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    
    print(f"\n{nutrient_name} Metrics:")
    print(f"  MAE: {mae:.2f}")
    print(f"  MSE: {mse:.2f}")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  R²: {r2:.4f}")
    
    return {
        'mae': mae,
        'mse': mse,
        'rmse': rmse,
        'r2': r2
    }

def train_models(X, y):
    """Train models for each nutritional component"""
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Dictionary to store trained models and their metrics
    models_info = {}
    
    # Hyperparameters for GridSearchCV
    param_grid = {
        'regressor__n_estimators': [50, 100, 200],
        'regressor__learning_rate': [0.01, 0.05, 0.1],
        'regressor__max_depth': [3, 5, 7],
        'regressor__min_samples_split': [2, 5, 10],
        'regressor__min_samples_leaf': [1, 2, 4]
    }
    
    # Train a separate model for each nutritional component
    for nutrient in y.columns:
        print(f"\n{'='*50}")
        print(f"Training model for {nutrient}...")
        print(f"{'='*50}")
        
        # Handle NaN values in target variable
        y_nutrient = y[nutrient].copy()
        valid_indices = ~y_nutrient.isna()
        X_clean = X[valid_indices].copy()
        y_clean = y_nutrient[valid_indices].copy()
        
        # Create stratification bins, handling cases where qcut might fail
        try:
            bins = pd.qcut(y_clean, q=min(5, len(y_clean.unique())), duplicates='drop')
            stratify = bins
        except Exception as e:
            print(f"Warning: Could not create stratification bins for {nutrient}: {str(e)}. Using random split.")
            stratify = None
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X_clean, y_clean, test_size=0.2, random_state=42, stratify=stratify
        )
        
        # Create and train the model with GridSearchCV
        pipeline = create_model_pipeline()
        
        # Use GridSearchCV for hyperparameter tuning
        grid_search = GridSearchCV(
            estimator=pipeline,
            param_grid=param_grid,
            cv=3,
            scoring='neg_mean_squared_error',
            n_jobs=-1,
            verbose=1
        )
        
        print("Performing grid search...")
        grid_search.fit(X_train, y_train)
        
        # Get the best model
        best_model = grid_search.best_estimator_
        
        # Make predictions
        y_pred_train = best_model.predict(X_train)
        y_pred_test = best_model.predict(X_test)
        
        # Evaluate on training set
        print("\nTraining Set Metrics:")
        train_metrics = evaluate_model(y_train, y_pred_train, "Training")
        
        # Evaluate on test set
        print("\nTest Set Metrics:")
        test_metrics = evaluate_model(y_test, y_pred_test, "Test")
        
        # Save the model
        model_path = f'models/model_{nutrient.lower().replace(" ", "_").replace("(", "").replace(")", "")}.joblib'
        joblib.dump(best_model, model_path)
        
        # Store model info
        models_info[nutrient] = {
            'model': best_model,
            'train_metrics': train_metrics,
            'test_metrics': test_metrics,
            'best_params': grid_search.best_params_
        }
        
        # Print best parameters
        print("\nBest Parameters:")
        for param, value in grid_search.best_params_.items():
            print(f"  {param}: {value}")
    
    print("\nAll models trained and saved successfully!")
    return models_info

def set_console_encoding():
    import sys
    import io
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def main():
    # Set console encoding to UTF-8
    set_console_encoding()
    
    # File path
    data_file = "Indian_Food_Nutrition_Processed.csv"
    
    try:
        print("Loading and preprocessing data...")
        X, y, dish_names = load_and_preprocess_data(data_file)
        print(f"\nDataset loaded with {len(X)} samples and {len(y.columns)} target variables.")
        
        print("\nSample of processed data:")
        print(X.head())
        
        print("\nTarget variables:", list(y.columns))
        
        # Train models
        print("\nStarting model training...")
        models_info = train_models(X, y)
        
        # Print summary of model performance
        print("\n" + "="*80)
        print("MODEL TRAINING SUMMARY".center(80))
        print("="*80 + "\n")
        
        # Create a mapping of problematic characters
        char_map = {
            '�': 'u',  # Replace mu with 'u' for micro
            '²': '2',  # Replace superscript 2 with regular 2
            '°': ' deg'  # Replace degree symbol with 'deg'
        }
        
        for nutrient in y.columns:
            # Replace special characters in nutrient names
            clean_nutrient = ''.join(char_map.get(c, c) for c in nutrient)
            print(f"\n{clean_nutrient.upper()}:")
            print(f"  Test R2: {models_info[nutrient]['test_metrics']['r2']:.4f}")
            print(f"  Test RMSE: {models_info[nutrient]['test_metrics']['rmse']:.2f}")
        
        print("\nTraining completed successfully!")
        
    except Exception as e:
        print(f"\nError during model training: {str(e)}")
        raise

if __name__ == "__main__":
    main()
