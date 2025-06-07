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
    const analyzeMealBtn = document.getElementById('analyzeMealBtn');
    const mealAnalysisDiv = document.getElementById('mealAnalysis');
    const analysisContent = document.getElementById('analysisContent');
    
    // Custom Food Modal Elements
    const customFoodModal = document.getElementById('customFoodModal');
    const addCustomFoodBtn = document.getElementById('addCustomFoodBtn');
    const saveCustomFoodBtn = document.getElementById('saveCustomFood');
    const cancelCustomFoodBtn = document.getElementById('cancelCustomFood');
    const closeModalBtn = document.querySelector('.close-btn');

    // Barcode Scanner Elements
    const barcodeModal = document.getElementById('barcodeModal');
    const scanBarcodeBtn = document.getElementById('scanBarcodeBtn');
    const closeBarcodeModal = document.getElementById('closeBarcodeModal');
    const startScannerBtn = document.getElementById('startScanner');
    const stopScannerBtn = document.getElementById('stopScanner');
    const switchCameraBtn = document.getElementById('switchCamera');
    const barcodeScanner = document.getElementById('barcode-scanner');
    const barcodeResult = document.getElementById('barcode-result');
    
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
        protein: 50
    };
    
    // Array to store consumed food items
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
        const quantity = parseFloat(quantityInput.value) || 0;
        
        if (!foodId || quantity <= 0) {
            alert('Please select a food item and enter a valid quantity.');
            return;
        }
        
        const food = nutritionData[foodId];
        if (!food) {
            alert('Selected food item not found.');
            return;
        }
        
        // Add to consumed items
        consumedItems.push({
            id: foodId,
            name: food.name,
            quantity: quantity,
            calories: (food.calories * quantity / (food.defaultQty || 100)).toFixed(1),
            protein: (food.protein * quantity / (food.defaultQty || 100)).toFixed(1),
            carbs: (food.carbs * quantity / (food.defaultQty || 100)).toFixed(1),
            fats: (food.fats * quantity / (food.defaultQty || 100)).toFixed(1),
            fiber: (food.fiber * quantity / (food.defaultQty || 100)).toFixed(1)
        });
        
        // Update the UI
        updateSelectedItemsList();
        
        // Clear the inputs
        foodItemSelect.value = '';
        quantityInput.value = '100';
        
        // Calculate and update nutrition
        const totals = calculateNutrition();
        updateNutritionDisplay(totals);
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
            totalCalories += parseFloat(item.calories);
            totalProtein += parseFloat(item.protein);
            totalCarbs += parseFloat(item.carbs);
            totalFats += parseFloat(item.fats);
            totalFiber += parseFloat(item.fiber);
        });
        
        // Update the UI with calculated values
        updateNutritionDisplay({
            calories: Math.round(totalCalories),
            protein: totalProtein.toFixed(1),
            carbs: totalCarbs.toFixed(1),
            fats: totalFats.toFixed(1),
            fiber: totalFiber.toFixed(1)
        });
        
        return {
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fats: totalFats,
            fiber: totalFiber
        };
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
        updateProgressBar('carbs', totals.carbs, 250);
        updateProgressBar('fats', totals.fats, 70);
        updateProgressBar('fiber', totals.fiber, 30);
        
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
            html += `
                <div class="food-item fade-in">
                    <div class="food-item-name">${item.name} (${item.quantity}g)</div>
                    <div class="food-item-nutrition">
                        <span>${item.calories} kcal</span>
                        <span>${item.protein}g P</span>
                        <span>${item.carbs}g C</span>
                        <span>${item.fats}g F</span>
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
        dailyGoals.protein = parseInt(proteinGoalInput.value) || 50;
        
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
    
    // Analyze the meal and provide insights
    function analyzeMeal() {
        if (consumedItems.length === 0) {
            alert('Please add some food items to analyze.');
            return;
        }
        
        const totals = calculateNutrition();
        const analysis = [];
        
        // Calculate meal balance score (0-100)
        const idealRatios = {
            protein: 0.25,
            carbs: 0.5,
            fats: 0.25
        };
        
        const totalMacros = totals.protein + totals.carbs + totals.fats + totals.fiber;
        const actualRatios = {
            protein: totals.protein / totalMacros,
            carbs: totals.carbs / totalMacros,
            fats: totals.fats / totalMacros
        };
        
        // Calculate balance score
        let balanceScore = 100;
        for (const macro in idealRatios) {
            balanceScore -= Math.abs((actualRatios[macro] - idealRatios[macro]) * 100);
        }
        balanceScore = Math.max(0, Math.min(100, balanceScore));
        
        // Calculate percentage of daily values
        const dailyValues = {
            calories: 2000,
            protein: 50,  // 50g is about 20% of 2000 calories
            carbs: 300,  // 300g is about 60% of 2000 calories
            fats: 65,    // 65g is about 30% of 2000 calories
            fiber: 25
        };
        
        // Generate nutrition summary
        analysis.push(`
            <div class="nutrition-summary-analysis">
                <h4>Nutrition Summary (per serving)</h4>
                <div class="nutrient-row">
                    <span class="nutrient-name">Calories</span>
                    <div class="nutrient-bar-container">
                        <div class="nutrient-bar" style="width: ${Math.min(100, (totals.calories / dailyValues.calories) * 100)}%;">
                            ${Math.round(totals.calories)}
                        </div>
                    </div>
                    <span class="nutrient-value">${Math.round(totals.calories)} kcal</span>
                </div>
                <div class="nutrient-row">
                    <span class="nutrient-name">Protein</span>
                    <div class="nutrient-bar-container">
                        <div class="nutrient-bar protein" style="width: ${Math.min(100, (totals.protein / dailyValues.protein) * 100)}%;">
                            ${totals.protein.toFixed(1)}
                        </div>
                    </div>
                    <span class="nutrient-value">${totals.protein.toFixed(1)}g</span>
                </div>
                <div class="nutrient-row">
                    <span class="nutrient-name">Carbs</span>
                    <div class="nutrient-bar-container">
                        <div class="nutrient-bar carbs" style="width: ${Math.min(100, (totals.carbs / dailyValues.carbs) * 100)}%;">
                            ${totals.carbs.toFixed(1)}
                        </div>
                    </div>
                    <span class="nutrient-value">${totals.carbs.toFixed(1)}g</span>
                </div>
                <div class="nutrient-row">
                    <span class="nutrient-name">Fats</span>
                    <div class="nutrient-bar-container">
                        <div class="nutrient-bar fats" style="width: ${Math.min(100, (totals.fats / dailyValues.fats) * 100)}%;">
                            ${totals.fats.toFixed(1)}
                        </div>
                    </div>
                    <span class="nutrient-value">${totals.fats.toFixed(1)}g</span>
                </div>
                <div class="nutrient-row">
                    <span class="nutrient-name">Fiber</span>
                    <div class="nutrient-bar-container">
                        <div class="nutrient-bar fiber" style="width: ${Math.min(100, (totals.fiber / dailyValues.fiber) * 100)}%;">
                            ${totals.fiber.toFixed(1)}
                        </div>
                    </div>
                    <span class="nutrient-value">${totals.fiber.toFixed(1)}g</span>
                </div>
            </div>
            <div class="analysis-score">Meal Balance Score: <strong>${Math.round(balanceScore)}/100</strong></div>
        `);
        
        // Macro distribution analysis
        analysis.push(`
            <div class="macro-distribution">
                <h4>Macronutrient Distribution</h4>
                <div class="macro-bars">
                    <div class="macro-bar protein" style="width: ${actualRatios.protein * 100}%">
                        <span>Protein ${(actualRatios.protein * 100).toFixed(0)}%</span>
                    </div>
                    <div class="macro-bar carbs" style="width: ${actualRatios.carbs * 100}%">
                        <span>Carbs ${(actualRatios.carbs * 100).toFixed(0)}%</span>
                    </div>
                    <div class="macro-bar fats" style="width: ${actualRatios.fats * 100}%">
                        <span>Fats ${(actualRatios.fats * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <div class="macro-legend">
                    <div><span class="legend-color protein"></span> Protein</div>
                    <div><span class="legend-color carbs"></span> Carbs</div>
                    <div><span class="legend-color fats"></span> Fats</div>
                </div>
            </div>
        `);
        
        // Generate detailed insights
        const insights = [];
        
        // Protein analysis
        if (totals.protein < 15) {
            insights.push(`<div class="analysis-item warning"><i class="fas fa-exclamation-triangle"></i> This meal is low in protein (${totals.protein.toFixed(1)}g). Consider adding protein sources like dal, paneer, or chicken.</div>`);
        } else if (totals.protein > 40) {
            insights.push(`<div class="analysis-item info"><i class="fas fa-info-circle"></i> This meal is high in protein (${totals.protein.toFixed(1)}g), which is great for muscle maintenance and satiety.</div>`);
        } else {
            insights.push(`<div class="analysis-item success"><i class="fas fa-check-circle"></i> Good protein content (${totals.protein.toFixed(1)}g) for this meal.</div>`);
        }
        
        // Fiber analysis
        if (totals.fiber < 5) {
            insights.push(`<div class="analysis-item warning"><i class="fas fa-exclamation-triangle"></i> This meal is low in fiber (${totals.fiber.toFixed(1)}g). Try adding more vegetables, fruits, or whole grains.</div>`);
        } else {
            insights.push(`<div class="analysis-item success"><i class="fas fa-check-circle"></i> Good fiber content (${totals.fiber.toFixed(1)}g)! Fiber helps with digestion and keeps you full longer.</div>`);
        }
        
        // Fat analysis
        if (totals.fats > 30) {
            insights.push(`<div class="analysis-item warning"><i class="fas fa-exclamation-triangle"></i> This meal is high in fats (${totals.fats.toFixed(1)}g). Consider using less oil or ghee in preparation.</div>`);
        }
        
        // Carbs analysis
        if (totals.carbs / totals.protein > 4) {
            insights.push(`<div class="analysis-item info"><i class="fas fa-info-circle"></i> This meal is relatively high in carbs (${totals.carbs.toFixed(1)}g) compared to protein. Consider adding more protein sources for better balance.</div>`);
        }
        
        // Meal timing suggestion
        const now = new Date();
        const hour = now.getHours();
        let timingSuggestion = '';
        
        if (hour < 10) {
            timingSuggestion = 'Breakfast';
            if (totals.calories < 300) {
                insights.push(`<div class="analysis-item info"><i class="fas fa-sun"></i> This breakfast is light (${Math.round(totals.calories)} kcal). Consider adding some fruits or nuts for sustained energy.</div>`);
            } else if (totals.calories > 600) {
                insights.push(`<div class="analysis-item info"><i class="fas fa-sun"></i> This breakfast is quite heavy (${Math.round(totals.calories)} kcal). You might feel sluggish later.</div>`);
            }
        } else if (hour < 16) {
            timingSuggestion = 'Lunch';
            if (totals.carbs / totals.protein > 4) {
                insights.push(`<div class="analysis-item info"><i class="fas fa-utensils"></i> This lunch is carb-heavy. Try adding more protein to avoid an energy crash later.</div>`);
            }
        } else {
            timingSuggestion = 'Dinner';
            if (totals.calories > 600) {
                insights.push(`<div class="analysis-item info"><i class="fas fa-moon"></i> This dinner is quite heavy (${Math.round(totals.calories)} kcal). Consider a lighter meal for better sleep and digestion.</div>`);
            }
        }
        
        // Add insights to analysis
        analysis.push(insights.join(''));
        
        // Add personalized prediction
        const prediction = generateNutritionPrediction(totals, timingSuggestion);
        analysis.push(`
            <div class="prediction">
                <h4>Nutrition Prediction</h4>
                <div class="prediction-content">${prediction}</div>
            </div>
        `);
        
        // Display the analysis
        analysisContent.innerHTML = analysis.join('');
        mealAnalysisDiv.classList.remove('hidden');
        
        // Scroll to analysis
        mealAnalysisDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Generate nutrition prediction based on meal composition
    function generateNutritionPrediction(totals, mealType) {
        const predictions = [];
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hour * 100 + minutes; // Convert to 24h format (e.g., 14:30 -> 1430)
        
        // Function to format time as HH:MM AM/PM
        const formatTime = (hr, min) => {
            const period = hr >= 12 ? 'PM' : 'AM';
            const displayHour = hr % 12 || 12;
            return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
        };
        
        // Add current time display
        predictions.push(`<strong>Current Time:</strong> ${formatTime(hour, minutes)}`);
        
        // Meal timing recommendations
        const nextMealTime = (() => {
            if (currentTime < 1000) return 'breakfast';
            if (currentTime < 1400) return 'lunch';
            if (currentTime < 2100) return 'dinner';
            return 'next morning';
        })();
        
        // Calculate time until next meal suggestion
        let nextMealSuggestion = '';
        if (currentTime < 800) {
            nextMealSuggestion = 'Breakfast time is ideal now (7:00-9:00 AM)';
        } else if (currentTime < 1000) {
            nextMealSuggestion = 'You can have a light snack before lunch';
        } else if (currentTime < 1230) {
            nextMealSuggestion = 'Good time for lunch (12:30-2:00 PM)';
        } else if (currentTime < 1500) {
            nextMealSuggestion = 'Consider an evening snack if needed';
        } else if (currentTime < 2030) {
            nextMealSuggestion = 'Ideal dinner time (7:00-8:30 PM)';
        } else {
            nextMealSuggestion = 'Avoid heavy meals now, consider light protein if needed';
        }
        
        // Add meal timing suggestion
        predictions.push(`<strong>Meal Timing:</strong> ${nextMealSuggestion}`);
        
        // Time-based eating window recommendations
        if (currentTime >= 2100 || currentTime <= 500) {
            predictions.push(`<strong>Late Night Eating:</strong> Try to finish eating 2-3 hours before bedtime for better digestion and sleep quality.`);
        }
        
        // Calculate hours since last meal (simplified)
        const lastMealHours = (() => {
            if (currentTime < 500) return 0; // Don't count overnight
            if (currentTime < 800) return hour + (60 - minutes) / 60; // Since last night
            if (currentTime < 1200) return hour - 8 + minutes / 60; // Since breakfast
            if (currentTime < 1500) return hour - 12 + minutes / 60; // Since lunch
            return hour - 15 + minutes / 60; // Since snack
        })();
        
        // Add fasting window information
        if (lastMealHours > 4) {
            predictions.push(`<strong>Fasting Window:</strong> It's been about ${Math.floor(lastMealHours)} hours since your last meal. Consider eating soon.`);
        } else if (lastMealHours > 2) {
            predictions.push(`<strong>Meal Spacing:</strong> Good interval since your last meal (${Math.floor(lastMealHours)} hours).`);
        } else {
            predictions.push(`<strong>Meal Spacing:</strong> Consider waiting ${Math.ceil(3 - lastMealHours)} more hours before your next meal for better digestion.`);
        }
        
        // Add time-specific hydration tips
        if (currentTime < 1200) {
            predictions.push(`<strong>Morning Hydration:</strong> Start your day with a glass of water to kickstart your metabolism.`);
        } else if (currentTime < 1800) {
            predictions.push(`<strong>Afternoon Hydration:</strong> Stay hydrated with water or herbal teas to maintain energy levels.`);
        } else {
            predictions.push(`<strong>Evening Hydration:</strong> Sip water, but reduce intake 1-2 hours before bed.`);
        }
        
        // Add a reminder for the next meal time
        const nextMealHour = (() => {
            if (currentTime < 1200) return 12; // Next meal: Lunch
            if (currentTime < 1900) return 19; // Next meal: Dinner
            return 7 + 24; // Next meal: Tomorrow's breakfast
        })();
        
        const hoursUntilNextMeal = (nextMealHour - hour - 1) + (60 - minutes) / 60;
        if (hoursUntilNextMeal > 0) {
            predictions.push(`<strong>Next Meal:</strong> Consider having your next meal in about ${Math.round(hoursUntilNextMeal)} hours (around ${formatTime(nextMealHour % 24, 0)}).`);
        }
        
        // Rest of your existing prediction logic...
        
        return predictions.map(p => `<p>• ${p}</p>`).join('');
    }
    
    // Initialize the app
    function init() {
        // Initialize food items dropdown
        initializeFoodItems();
        
        // Add all event listeners
        addEventListeners();
        
        // Initialize with empty selected items
        updateSelectedItemsList();
        
        // Calculate initial nutrition (will show 0 values)
        const totals = calculateNutrition();
        updateNutritionDisplay(totals);
    }
    
    // Add event listeners
    function addEventListeners() {
        addItemBtn.addEventListener('click', addSelectedItem);
        quantityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addSelectedItem();
        });
        
        updateGoalsBtn.addEventListener('click', updateDailyGoals);
        analyzeMealBtn.addEventListener('click', analyzeMeal);
        
        // Custom food modal events
        addCustomFoodBtn.addEventListener('click', () => {
            customFoodModal.style.display = 'flex';
            document.getElementById('customFoodName').focus();
        });
        
        closeModalBtn.addEventListener('click', closeCustomFoodModal);
        cancelCustomFoodBtn.addEventListener('click', closeCustomFoodModal);
        
        saveCustomFoodBtn.addEventListener('click', saveCustomFood);
        
        // Close modal when clicking outside the content
        window.addEventListener('click', (e) => {
            if (e.target === customFoodModal) {
                closeCustomFoodModal();
            }
        });
        
        // Add click handlers for suggestion tags
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const foodId = this.getAttribute('data-item');
                const quantity = this.getAttribute('data-qty');
                
                foodItemSelect.value = foodId;
                quantityInput.value = quantity;
                addSelectedItem();
            });
        });
        
        // Barcode scanner events
        scanBarcodeBtn.addEventListener('click', openBarcodeScanner);
        closeBarcodeModal.addEventListener('click', closeBarcodeScanner);
        startScannerBtn.addEventListener('click', startBarcodeScanner);
        stopScannerBtn.addEventListener('click', stopBarcodeScanner);
        switchCameraBtn.addEventListener('click', switchCamera);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === barcodeModal) {
                closeBarcodeScanner();
            }
        });
    }
    
    // Close the custom food modal
    function closeCustomFoodModal() {
        customFoodModal.style.display = 'none';
        // Reset form
        document.getElementById('customFoodForm').reset();
    }
    
    // Save custom food and add to list
    function saveCustomFood() {
        const name = document.getElementById('customFoodName').value.trim();
        const calories = parseFloat(document.getElementById('customFoodCalories').value);
        const protein = parseFloat(document.getElementById('customFoodProtein').value) || 0;
        const carbs = parseFloat(document.getElementById('customFoodCarbs').value) || 0;
        const fats = parseFloat(document.getElementById('customFoodFats').value) || 0;
        const fiber = parseFloat(document.getElementById('customFoodFiber').value) || 0;
        const serving = parseFloat(document.getElementById('customFoodServing').value) || 100;
        
        // Basic validation
        if (!name || isNaN(calories) || calories <= 0) {
            alert('Please enter a valid food name and calories');
            return;
        }
        
        // Create a unique ID for the custom food
        const foodId = 'custom_' + name.toLowerCase().replace(/\s+/g, '_');
        
        // Add to nutrition data
        nutritionData[foodId] = {
            name: name,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fats: fats,
            fiber: fiber,
            defaultQty: serving,
            isCustom: true // Flag to identify custom foods
        };
        
        // Add to dropdown
        const option = document.createElement('option');
        option.value = foodId;
        option.textContent = name + ' (Custom)';
        
        // Add to the first optgroup or create one if it doesn't exist
        let customGroup = foodItemSelect.querySelector('optgroup[label="Custom Foods"]');
        if (!customGroup) {
            customGroup = document.createElement('optgroup');
            customGroup.label = 'Custom Foods';
            foodItemSelect.appendChild(customGroup);
        }
        customGroup.appendChild(option);
        
        // Select the new food item
        foodItemSelect.value = foodId;
        
        // Close the modal and reset form
        closeCustomFoodModal();
        
        // Focus on quantity input for quick entry
        quantityInput.focus();
        quantityInput.select();
    }
    
    // Barcode Scanner Functions
    function openBarcodeScanner() {
        barcodeModal.style.display = 'flex';
        startScannerBtn.disabled = false;
        stopScannerBtn.disabled = true;
        barcodeResult.innerHTML = '<p>Click "Start Scanner" to begin</p>';
        barcodeResult.className = 'barcode-result';
    }
    
    function closeBarcodeScanner() {
        stopBarcodeScanner();
        barcodeModal.style.display = 'none';
    }
    
    async function startBarcodeScanner() {
        try {
            barcodeResult.innerHTML = '<div class="spinner"></div><p>Initializing scanner...</p>';
            document.querySelector('.spinner').style.display = 'block';
            
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            
            currentStream = stream;
            barcodeScanner.srcObject = stream;
            barcodeScanner.play();
            
            // Initialize Quagga
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: barcodeScanner,
                    constraints: {
                        facingMode: 'environment',
                        width: { min: 640 },
                        height: { min: 480 }
                    },
                },
                decoder: {
                    readers: [
                        'ean_reader',
                        'ean_8_reader',
                        'code_128_reader',
                        'code_39_reader',
                        'code_39_vin_reader',
                        'upc_reader',
                        'upc_e_reader'
                    ]
                }
            }, function(err) {
                if (err) {
                    console.error('Quagga initialization error:', err);
                    barcodeResult.innerHTML = `<p class="error">Error initializing scanner: ${err.message}</p>`;
                    barcodeResult.className = 'barcode-result error';
                    return;
                }
                
                Quagga.start();
                scannerActive = true;
                startScannerBtn.disabled = true;
                stopScannerBtn.disabled = false;
                barcodeResult.innerHTML = '<p>Point the camera at a barcode to scan</p>';
                document.querySelector('.spinner').style.display = 'none';
            });
            
            Quagga.onDetected(async function(result) {
                if (!scannerActive) return;
                
                const code = result.codeResult.code;
                barcodeResult.innerHTML = '<div class="spinner"></div><p>Looking up product details...</p>';
                document.querySelector('.spinner').style.display = 'block';
                
                try {
                    const product = await fetchProductByBarcode(code);
                    if (product) {
                        await addProductToDatabase(product);
                        barcodeResult.innerHTML = `<p>Success! Added ${product.product_name || 'product'}</p>`;
                        barcodeResult.className = 'barcode-result success';
                        
                        // Auto-close after success
                        setTimeout(closeBarcodeScanner, 2000);
                    } else {
                        throw new Error('Product not found');
                    }
                } catch (error) {
                    barcodeResult.innerHTML = `<p>Error: ${error.message}</p>`;
                    barcodeResult.className = 'barcode-result error';
                    console.error('Barcode scan error:', error);
                } finally {
                    document.querySelector('.spinner').style.display = 'none';
                }
            });
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            barcodeResult.innerHTML = `<p class="error">Error accessing camera: ${error.message}</p>`;
            barcodeResult.className = 'barcode-result error';
        }
    }
    
    function stopBarcodeScanner() {
        if (scannerActive) {
            Quagga.stop();
            scannerActive = false;
        }
        
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        
        barcodeScanner.srcObject = null;
        startScannerBtn.disabled = false;
        stopScannerBtn.disabled = true;
    }
    
    function switchCamera() {
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        stopBarcodeScanner();
        startBarcodeScanner();
    }
    
    async function fetchProductByBarcode(barcode) {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            
            if (data.status === 0 || !data.product) {
                throw new Error('Product not found in database');
            }
            
            const product = data.product;
            return {
                name: product.product_name || `Product ${barcode}`,
                calories: product.nutriments?.['energy-kcal_100g'] || 0,
                protein: product.nutriments?.proteins_100g || 0,
                carbs: product.nutriments?.carbohydrates_100g || 0,
                fats: product.nutriments?.fat_100g || 0,
                fiber: product.nutriments?.fiber_100g || 0,
                serving_size: product.serving_quantity ? 
                    `${product.serving_quantity} ${product.serving_quantity_unit || 'g'}` : '100g',
                image_url: product.image_url || ''
            };
            
        } catch (error) {
            console.error('Error fetching product:', error);
            throw new Error('Failed to fetch product details');
        }
    }
    
    async function addProductToDatabase(product) {
        const foodId = 'barcode_' + Date.now();
        
        // Add to nutrition data
        nutritionData[foodId] = {
            name: product.name,
            calories: product.calories,
            protein: product.protein,
            carbs: product.carbs,
            fats: product.fats,
            fiber: product.fiber,
            defaultQty: 100, // Standard 100g serving
            isCustom: true,
            fromBarcode: true,
            imageUrl: product.image_url
        };
        
        // Add to dropdown
        const option = document.createElement('option');
        option.value = foodId;
        option.textContent = `${product.name} (Scanned)`;
        
        // Add to the first optgroup or create one if it doesn't exist
        let customGroup = foodItemSelect.querySelector('optgroup[label="Scanned Items"]');
        if (!customGroup) {
            customGroup = document.createElement('optgroup');
            customGroup.label = 'Scanned Items';
            foodItemSelect.appendChild(customGroup);
        }
        customGroup.appendChild(option);
        
        // Select the new food item
        foodItemSelect.value = foodId;
        quantityInput.value = '100';
        
        return foodId;
    }
    
    // Start the app
    init();
});