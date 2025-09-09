// DOM Elements
const dishSearchInput = document.getElementById('dishSearch');
const searchBtn = document.getElementById('searchBtn');
const nutritionResults = document.getElementById('nutritionResults');
const dietPlanForm = document.getElementById('dietPlanForm');
const dietPlanResults = document.getElementById('dietPlanResults');

// Global variables
let dishNames = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load dish names for autocomplete
    fetchDishNames();
    
    // Initialize event listeners
    searchBtn.addEventListener('click', handleDishSearch);
    dishSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleDishSearch();
        }
    });
    
    dietPlanForm.addEventListener('submit', handleDietPlanSubmit);
    
    // Initialize autocomplete
    initializeAutocomplete();
});

// Fetch dish names for autocomplete
async function fetchDishNames() {
    try {
        const response = await fetch('/dish-names');
        if (response.ok) {
            dishNames = await response.json();
            updateAutocomplete(dishNames);
        }
    } catch (error) {
        console.error('Error fetching dish names:', error);
    }
}

// Handle dish search
async function handleDishSearch() {
    const dishName = dishSearchInput.value.trim();
    
    if (!dishName) {
        showAlert('Please enter a dish name', 'warning');
        return;
    }
    
    // Show loading state
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...';
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dish_name: dishName })
        });
        
        if (!response.ok) {
            throw new Error('Dish not found');
        }
        
        const data = await response.json();
        displayNutritionInfo(data);
    } catch (error) {
        showAlert('Dish not found. Please try another name.', 'danger');
        console.error('Error:', error);
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
    }
}

// Display nutrition information
function displayNutritionInfo(data) {
    const { dish_name, nutrition } = data;
    
    // Format the nutrition data
    const nutritionHtml = `
        <div class="nutrition-card fade-in">
            <h4>${dish_name}</h4>
            <div class="row">
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Calories (kcal)']}</div>
                        <div class="nutrition-label">Calories (kcal)</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Carbohydrates (g)']}g</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Protein (g)']}g</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Fats (g)']}g</div>
                        <div class="nutrition-label">Fats</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Free Sugar (g)']}g</div>
                        <div class="nutrition-label">Sugar</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Fibre (g)']}g</div>
                        <div class="nutrition-label">Fiber</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Sodium (mg)']}mg</div>
                        <div class="nutrition-label">Sodium</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Calcium (mg)']}mg</div>
                        <div class="nutrition-label">Calcium</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Iron (mg)']}mg</div>
                        <div class="nutrition-label">Iron</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Vitamin C (mg)']}mg</div>
                        <div class="nutrition-label">Vitamin C</div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="text-center">
                        <div class="nutrition-value">${nutrition['Folate (µg)']}µg</div>
                        <div class="nutrition-label">Folate</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    nutritionResults.innerHTML = nutritionHtml;
}

// Handle diet plan form submission
async function handleDietPlanSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        activity_level: document.getElementById('activity').value,
        goal: document.getElementById('goal').value
    };
    
    // Show loading state
    const submitBtn = dietPlanForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
    
    try {
        const response = await fetch('/generate_plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate diet plan');
        }
        
        const data = await response.json();
        displayDietPlan(data);
    } catch (error) {
        showAlert('Failed to generate diet plan. Please try again.', 'danger');
        console.error('Error:', error);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Display diet plan
function displayDietPlan(data) {
    const { bmr, tdee, meal_plan } = data;
    
    let mealsHtml = '';
    
    // Generate meal cards
    for (const [mealTime, meal] of Object.entries(meal_plan)) {
        mealsHtml += `
            <div class="meal-card fade-in">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="meal-time">${mealTime}</div>
                        <div class="meal-details">
                            <h5>${meal.dish}</h5>
                            <span class="text-muted">${Math.round(meal.calories)} calories</span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary">View Recipe</button>
                </div>
            </div>
        `;
    }
    
    const dietPlanHtml = `
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Your Daily Needs</h5>
                        <div class="my-4">
                            <div class="display-4 fw-bold text-primary">${Math.round(tdee)}</div>
                            <div class="text-muted">Calories per day</div>
                        </div>
                        <div class="d-flex justify-content-around">
                            <div>
                                <div class="fw-bold">${Math.round(bmr)}</div>
                                <div class="small text-muted">BMR</div>
                            </div>
                            <div>
                                <div class="fw-bold">${Math.round(tdee - bmr)}</div>
                                <div class="small text-muted">Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <h5 class="mb-3">Your Daily Meal Plan</h5>
                ${mealsHtml}
                <div class="text-end mt-3">
                    <button class="btn btn-outline-primary me-2">
                        <i class="fas fa-print me-1"></i> Print Plan
                    </button>
                    <button class="btn btn-primary">
                        <i class="fas fa-utensils me-1"></i> Generate Shopping List
                    </button>
                </div>
            </div>
        </div>
    `;
    
    dietPlanResults.innerHTML = dietPlanHtml;
    
    // Scroll to results
    dietPlanResults.scrollIntoView({ behavior: 'smooth' });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert alert at the top of the main content
    const main = document.querySelector('main');
    main.insertBefore(alertDiv, main.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Initialize autocomplete
function initializeAutocomplete() {
    // This will be enhanced with a proper autocomplete library in production
    const datalist = document.createElement('datalist');
    datalist.id = 'dishSuggestions';
    dishSearchInput.setAttribute('list', 'dishSuggestions');
    dishSearchInput.parentNode.insertBefore(datalist, dishSearchInput.nextSibling);
}

// Update autocomplete options
function updateAutocomplete(dishes) {
    const datalist = document.getElementById('dishSuggestions');
    if (!datalist) return;
    
    // Clear existing options
    datalist.innerHTML = '';
    
    // Add new options
    dishes.forEach(dish => {
        const option = document.createElement('option');
        option.value = dish;
        datalist.appendChild(option);
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
