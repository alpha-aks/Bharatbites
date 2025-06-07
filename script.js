document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mealInput = document.getElementById('mealInput');
    const foodItemSelect = document.getElementById('foodItem');
    const quantityInput = document.getElementById('quantity');
    const addItemBtn = document.getElementById('addItemBtn');
    const selectedItemsDiv = document.getElementById('selectedItems');
    const resultDiv = document.getElementById('result');
    const suggestionTags = document.querySelectorAll('.tag');
    const caloriesGoalInput = document.getElementById('caloriesGoal');
    const proteinGoalInput = document.getElementById('proteinGoal');
    const updateGoalsBtn = document.getElementById('updateGoals');

    // Comprehensive Nutrition Database
    const nutritionData = {
        // ===== BREADS & ROTIS =====
        roti: { 
            name: "Roti/Chapati",
            calories: 120, protein: 4, carbs: 20, fats: 3, fiber: 2, defaultQty: 50
        },
        paratha: {
            name: "Paratha (Plain)",
            calories: 180, protein: 5, carbs: 25, fats: 7, fiber: 2, defaultQty: 60
        },
        aloo_paratha: {
            name: "Aloo Paratha",
            calories: 280, protein: 7, carbs: 40, fats: 10, fiber: 4, defaultQty: 100
        },
        puri: {
            name: "Puri",
            calories: 150, protein: 3, carbs: 15, fats: 8, fiber: 1, defaultQty: 30
        },
        bhatura: {
            name: "Bhatura",
            calories: 200, protein: 5, carbs: 30, fats: 12, fiber: 2, defaultQty: 70
        },
        naan: {
            name: "Naan",
            calories: 260, protein: 8, carbs: 45, fats: 15, fiber: 3, defaultQty: 90
        },
        thepla: {
            name: "Thepla",
            calories: 150, protein: 5, carbs: 20, fats: 6, fiber: 3, defaultQty: 50
        },
        
        // ===== RICE DISHES =====
        rice: {
            name: "Steamed Rice",
            calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, defaultQty: 100
        },
        jeera_rice: {
            name: "Jeera Rice",
            calories: 180, protein: 3, carbs: 35, fats: 4, fiber: 1, defaultQty: 100
        },
        pulao: {
            name: "Veg Pulao",
            calories: 200, protein: 4, carbs: 40, fats: 5, fiber: 3, defaultQty: 150
        },
        biryani: {
            name: "Veg Biryani",
            calories: 250, protein: 6, carbs: 45, fats: 8, fiber: 4, defaultQty: 200
        },
        lemon_rice: {
            name: "Lemon Rice",
            calories: 180, protein: 3, carbs: 35, fats: 4, fiber: 2, defaultQty: 100
        },
        
        // ===== DALS & LEGUMES =====
        dal_tadka: {
            name: "Dal Tadka",
            calories: 150, protein: 7, carbs: 20, fats: 4, fiber: 5, defaultQty: 150
        },
        dal_makhani: {
            name: "Dal Makhani",
            calories: 250, protein: 10, carbs: 25, fats: 12, fiber: 6, defaultQty: 150
        },
        sambar: {
            name: "Sambar",
            calories: 100, protein: 5, carbs: 15, fats: 2, fiber: 4, defaultQty: 150
        },
        rasam: {
            name: "Rasam",
            calories: 50, protein: 2, carbs: 10, fats: 1, fiber: 2, defaultQty: 150
        },
        rajma: {
            name: "Rajma Masala",
            calories: 220, protein: 12, carbs: 30, fats: 5, fiber: 8, defaultQty: 150
        },
        chana_masala: {
            name: "Chana Masala",
            calories: 200, protein: 10, carbs: 35, fats: 5, fiber: 9, defaultQty: 150
        },
        
        // ===== VEGETABLE DISHES =====
        aloo_gobi: {
            name: "Aloo Gobi",
            calories: 150, protein: 4, carbs: 20, fats: 6, fiber: 5, defaultQty: 150
        },
        baingan_bharta: {
            name: "Baingan Bharta",
            calories: 120, protein: 3, carbs: 15, fats: 6, fiber: 4, defaultQty: 150
        },
        palak_paneer: {
            name: "Palak Paneer",
            calories: 280, protein: 15, carbs: 12, fats: 20, fiber: 4, defaultQty: 150
        },
        malai_kofta: {
            name: "Malai Kofta",
            calories: 320, protein: 8, carbs: 25, fats: 22, fiber: 4, defaultQty: 150
        },
        bhindi_masala: {
            name: "Bhindi Masala",
            calories: 130, protein: 4, carbs: 15, fats: 7, fiber: 5, defaultQty: 150
        },
        
        // ===== SNACKS & APPETIZERS =====
        samosa: {
            name: "Samosa",
            calories: 250, protein: 4, carbs: 30, fats: 12, fiber: 3, defaultQty: 100
        },
        kachori: {
            name: "Kachori",
            calories: 200, protein: 5, carbs: 25, fats: 10, fiber: 2, defaultQty: 80
        },
        pakora: {
            name: "Vegetable Pakora",
            calories: 180, protein: 4, carbs: 20, fats: 10, fiber: 3, defaultQty: 100
        },
        vada: {
            name: "Medu Vada",
            calories: 150, protein: 5, carbs: 25, fats: 4, fiber: 3, defaultQty: 80
        },
        idli: {
            name: "Idli",
            calories: 70, protein: 3, carbs: 15, fats: 0.5, fiber: 1, defaultQty: 50
        },
        dosa: {
            name: "Plain Dosa",
            calories: 150, protein: 4, carbs: 25, fats: 4, fiber: 2, defaultQty: 100
        },
        
        // ===== DAIRY & PANEER =====
        paneer: {
            name: "Paneer (Cottage Cheese)",
            calories: 265, protein: 18, carbs: 4, fats: 20, fiber: 0, defaultQty: 100
        },
        paneer_tikka: {
            name: "Paneer Tikka",
            calories: 290, protein: 20, carbs: 8, fats: 22, fiber: 1, defaultQty: 100
        },
        dahi: {
            name: "Curd/Yogurt",
            calories: 60, protein: 3.5, carbs: 5, fats: 3.3, fiber: 0, defaultQty: 100
        },
        lassi: {
            name: "Sweet Lassi",
            calories: 150, protein: 5, carbs: 25, fats: 4, fiber: 1, defaultQty: 200
        },
        
        // ===== SWEETS & DESSERTS =====
        gulab_jamun: {
            name: "Gulab Jamun (1 piece)",
            calories: 150, protein: 2, carbs: 20, fats: 7, fiber: 0, defaultQty: 40
        },
        rasgulla: {
            name: "Rasgulla (1 piece)",
            calories: 100, protein: 2, carbs: 20, fats: 1, fiber: 0, defaultQty: 30
        },
        kheer: {
            name: "Kheer (Rice Pudding)",
            calories: 300, protein: 8, carbs: 50, fats: 8, fiber: 1, defaultQty: 150
        },
        halwa: {
            name: "Gajar Ka Halwa",
            calories: 250, protein: 4, carbs: 35, fats: 12, fiber: 2, defaultQty: 100
        },
        
        // ===== BEVERAGES =====
        masala_chai: {
            name: "Masala Chai (1 cup)",
            calories: 100, protein: 2, carbs: 15, fats: 4, fiber: 0, defaultQty: 150
        },
        coffee: {
            name: "Coffee (with milk & sugar)",
            calories: 120, protein: 2, carbs: 20, fats: 3, fiber: 0, defaultQty: 150
        },
        nimbu_paani: {
            name: "Nimbu Paani (Lemonade)",
            calories: 100, protein: 0, carbs: 25, fats: 0, fiber: 0, defaultQty: 200
        },
        
        // ===== ACCOMPANIMENTS =====
        papad: {
            name: "Papad (1 piece)",
            calories: 50, protein: 2, carbs: 10, fats: 0.5, fiber: 1, defaultQty: 10
        },
        pickle: {
            name: "Pickle (1 tbsp)",
            calories: 20, protein: 0, carbs: 5, fats: 0, fiber: 1, defaultQty: 15
        },
        chutney: {
            name: "Chutney (1 tbsp)",
            calories: 45, protein: 1, carbs: 10, fats: 0.5, fiber: 1, defaultQty: 20
        },
        raita: {
            name: "Raita",
            calories: 80, protein: 3, carbs: 8, fats: 4, fiber: 1, defaultQty: 100
        }
    };

    // User's daily goals (default values)
    let dailyGoals = {
        calories: 2000,
        protein: 120,  // in grams
        carbs: 250,    // in grams
        fats: 70,      // in grams
        fiber: 30      // in grams
    };

    // Track consumed items
    let consumedItems = [];

    // Initialize the food item dropdown
    function initializeFoodItems() {
        foodItemSelect.innerHTML = '<option value="">Select or type above</option>';
        
        // Group foods by category for better organization
        const foodCategories = {
            'Breads & Rotis': ['roti', 'paratha', 'aloo_paratha', 'puri', 'bhatura', 'naan', 'thepla'],
            'Rice Dishes': ['rice', 'jeera_rice', 'pulao', 'biryani', 'lemon_rice'],
            'Dals & Legumes': ['dal_tadka', 'dal_makhani', 'sambar', 'rasam', 'rajma', 'chana_masala'],
            'Vegetable Dishes': ['aloo_gobi', 'baingan_bharta', 'palak_paneer', 'malai_kofta', 'bhindi_masala'],
            'Snacks & Appetizers': ['samosa', 'kachori', 'pakora', 'vada', 'idli', 'dosa'],
            'Dairy & Paneer': ['paneer', 'paneer_tikka', 'dahi', 'lassi'],
            'Sweets & Desserts': ['gulab_jamun', 'rasgulla', 'kheer', 'halwa'],
            'Beverages': ['masala_chai', 'coffee', 'nimbu_paani'],
            'Accompaniments': ['papad', 'pickle', 'chutney', 'raita']
            // Add more categories as needed
        };
        
        // Add optgroups for each category
        for (const [category, items] of Object.entries(foodCategories)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            
            items.forEach(foodId => {
                const option = document.createElement('option');
                option.value = foodId;
                option.textContent = nutritionData[foodId].name;
                optgroup.appendChild(option);
            });
            
            foodItemSelect.appendChild(optgroup);
        }
    }


    // Add selected food item to the list
    function addSelectedItem() {
        const foodId = foodItemSelect.value;
        let quantity = parseInt(quantityInput.value) || 100; // Default to 100g if not specified
        
        if (!foodId) {
            alert('Please select a food item');
            return;
        }
        
        // Add to consumed items
        consumedItems.push({
            id: foodId,
            name: nutritionData[foodId].name,
            quantity: quantity
        });
        
        // Update the UI
        updateSelectedItemsList();
        calculateNutrition();
        
        // Reset inputs
        foodItemSelect.value = '';
        quantityInput.value = nutritionData[foodId]?.defaultQty || 100;
        mealInput.value = ''; // Clear the text input
    }

    // Update the selected items list in the UI
    function updateSelectedItemsList() {
        selectedItemsDiv.innerHTML = '';
        
        if (consumedItems.length === 0) {
            selectedItemsDiv.innerHTML = '<p class="no-items">No items added yet</p>';
            return;
        }
        
        consumedItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item fade-in';
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">${item.quantity}g</span>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedItemsDiv.appendChild(itemDiv);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                consumedItems.splice(index, 1);
                updateSelectedItemsList();
                calculateNutrition();
            });
        });
    }

    // Calculate total nutrition from consumed items
    function calculateNutrition() {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let totalFiber = 0;
        
        // Calculate totals
        consumedItems.forEach(item => {
            const food = nutritionData[item.id];
            if (food) {
                const ratio = item.quantity / (food.defaultQty || 100);
                totalCalories += Math.round(food.calories * ratio);
                totalProtein += food.protein * ratio;
                totalCarbs += food.carbs * ratio;
                totalFats += food.fats * ratio;
                totalFiber += food.fiber * ratio;
            }
        });
        
        // Update the UI with calculated values
        updateNutritionDisplay({
            calories: Math.round(totalCalories),
            protein: totalProtein.toFixed(1),
            carbs: totalCarbs.toFixed(1),
            fats: totalFats.toFixed(1),
            fiber: totalFiber.toFixed(1)
        });
    }
    
    // Update the nutrition display
    function updateNutritionDisplay(totals) {
        // Update main nutrition cards
        document.getElementById('calories').textContent = totals.calories;
        document.getElementById('protein').textContent = `${totals.protein}g`;
        
        // Update macros
        document.getElementById('carbs').textContent = `${totals.carbs}g`;
        document.getElementById('fats').textContent = `${totals.fats}g`;
        document.getElementById('fiber').textContent = `${totals.fiber}g`;
        
        // Update progress bars
        updateProgressBar('calories', totals.calories, dailyGoals.calories);
        updateProgressBar('protein', totals.protein, dailyGoals.protein);
        updateProgressBar('carbs', totals.carbs, dailyGoals.carbs);
        updateProgressBar('fats', totals.fats, dailyGoals.fats);
        updateProgressBar('fiber', totals.fiber, dailyGoals.fiber);
        
        // Update food breakdown
        updateFoodBreakdown();
    }
    
    // Update progress bar for a specific nutrient
    function updateProgressBar(nutrient, current, goal) {
        const progressBar = document.getElementById(`${nutrient}-progress`);
        if (!progressBar) return;
        
        const percentage = Math.min(100, (current / goal) * 100);
        progressBar.style.width = `${percentage}%`;
        
        // Change color based on percentage
        progressBar.className = 'progress-bar';
        if (percentage > 90) {
            progressBar.classList.add('danger');
        } else if (percentage > 70) {
            progressBar.classList.add('warning');
        }
    }
    
    // Update the food breakdown section
    function updateFoodBreakdown() {
        const breakdownDiv = document.getElementById('foodBreakdown');
        if (!breakdownDiv) return;
        
        if (consumedItems.length === 0) {
            breakdownDiv.innerHTML = '<p class="no-items">Add food items to see detailed breakdown</p>';
            return;
        }
        
        let html = '<h3>Meal Breakdown</h3><div class="food-items">';
        
        consumedItems.forEach((item, index) => {
            const food = nutritionData[item.id];
            if (!food) return;
            
            const ratio = item.quantity / (food.defaultQty || 100);
            const calories = Math.round(food.calories * ratio);
            const protein = (food.protein * ratio).toFixed(1);
            const carbs = (food.carbs * ratio).toFixed(1);
            const fats = (food.fats * ratio).toFixed(1);
            
            html += `
                <div class="food-item fade-in">
                    <div class="food-item-name">${item.name} (${item.quantity}g)</div>
                    <div class="food-item-nutrition">
                        <span>${calories} kcal</span>
                        <span>${protein}g P</span>
                        <span>${carbs}g C</span>
                        <span>${fats}g F</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        breakdownDiv.innerHTML = html;
    }
    
    // Update daily goals
    function updateDailyGoals() {
        dailyGoals.calories = parseInt(caloriesGoalInput.value) || 2000;
        dailyGoals.protein = parseInt(proteinGoalInput.value) || 120;
        
        // Recalculate to update progress bars
        calculateNutrition();
        
        // Show confirmation
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation';
        confirmation.textContent = 'Goals updated successfully!';
        updateGoalsBtn.parentNode.insertBefore(confirmation, updateGoalsBtn.nextSibling);
        
        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }
    
    // Initialize the app
    function init() {
        // Initialize food items dropdown
        initializeFoodItems();
        
        // Set default values
        caloriesGoalInput.value = dailyGoals.calories;
        proteinGoalInput.value = dailyGoals.protein;
        
        // Event listeners
        addItemBtn.addEventListener('click', addSelectedItem);
        updateGoalsBtn.addEventListener('click', updateDailyGoals);
        
        // Add food item on Enter key in quantity input
        quantityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSelectedItem();
            }
        });
        
        // Quick add from suggestion tags
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const foodId = this.getAttribute('data-item');
                const quantity = this.getAttribute('data-qty') || 100;
                
                if (nutritionData[foodId]) {
                    foodItemSelect.value = foodId;
                    quantityInput.value = quantity;
                    addSelectedItem();
                }
            });
        });
        
        // Initialize with empty state
        updateSelectedItemsList();
        calculateNutrition();
    }
    
    // Start the app
    init();
});