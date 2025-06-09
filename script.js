document.addEventListener('DOMContentLoaded', function() {
    // ... (rest of the code remains the same)

    // Weight Prediction and Telegram Sharing
    const BOT_TOKEN = '6914762602:AAHwQ4z7q1vW4eXjvJqWqWqWqWqWqWqWqWq'; // Replace with your actual bot token
    const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    // DOM Elements
    const calculateWeightGoalBtn = document.getElementById('calculateWeightGoal');
    const weightPredictionResult = document.getElementById('weightPredictionResult');
    const shareToTelegramBtn = document.getElementById('shareToTelegramBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const telegramStatus = document.getElementById('telegramStatus');

    // Calculate weight prediction
    function calculateWeightPrediction() {
        // Get input values
        const currentWeight = parseFloat(document.getElementById('currentWeight').value);
        const targetWeight = parseFloat(document.getElementById('targetWeight').value);
        const activityLevel = parseFloat(document.getElementById('activityLevel').value);
        
        // Validate inputs
        if (isNaN(currentWeight) || isNaN(targetWeight) || currentWeight <= 0) {
            alert('Please enter valid weight values');
            return;
        }
        
        // Show results section
        const resultDiv = document.getElementById('weightPredictionResult');
        resultDiv.style.display = 'block';
        
        // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
        const age = 30; // Default age, can be made configurable
        const height = 170; // Default height in cm, can be made configurable
        const isMale = true; // Default gender, can be made configurable
        
        let bmr;
        if (isMale) {
            bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const tdee = bmr * activityLevel;
        
        // Adjust calories based on goal (deficit for weight loss, surplus for weight gain)
        const isWeightLoss = currentWeight > targetWeight;
        const calorieAdjustment = isWeightLoss ? -500 : 500; // 500 kcal deficit/surplus per day
        const dailyCalories = Math.round(tdee + calorieAdjustment);
        
        // Macronutrient distribution (40% carbs, 30% protein, 30% fat)
        const proteinGrams = Math.round((dailyCalories * 0.3) / 4); // 4 kcal per gram
        const fatGrams = Math.round((dailyCalories * 0.3) / 9); // 9 kcal per gram
        const carbGrams = Math.round((dailyCalories * 0.4) / 4); // 4 kcal per gram
        
        // Update UI with calculated values
        document.getElementById('dailyCalories').textContent = `${dailyCalories} kcal`;
        document.getElementById('dailyProtein').textContent = `${proteinGrams}g (${Math.round(proteinGrams * 4)} kcal)`;
        document.getElementById('dailyCarbs').textContent = `${carbGrams}g (${Math.round(carbGrams * 4)} kcal)`;
        document.getElementById('dailyFats').textContent = `${fatGrams}g (${Math.round(fatGrams * 9)} kcal)`;
        
        // Calculate and show projected date
        const weightDifference = Math.abs(currentWeight - targetWeight);
        const weeksToGoal = Math.ceil(weightDifference / 0.5); // Assuming 0.5kg per week
        const today = new Date();
        const projectedDate = new Date(today);
        projectedDate.setDate(today.getDate() + (weeksToGoal * 7));
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('projectedDate').innerHTML = `
            <p>Projected to reach goal by: <strong>${projectedDate.toLocaleDateString('en-US', options)}</strong></p>
            <p>Estimated time: <strong>${weeksToGoal} weeks</strong> (0.5kg per week)</p>
        `;
        
        // Add diet tips
        const tipsContainer = document.getElementById('dietTips');
        const tips = isWeightLoss ? [
            'Aim for high-protein meals to maintain muscle mass',
            'Include plenty of vegetables for fiber and nutrients',
            'Stay hydrated - drink at least 2L of water daily',
            'Limit processed foods and added sugars',
            'Combine with regular exercise for best results'
        ] : [
            'Focus on calorie-dense, nutrient-rich foods',
            'Eat frequent, balanced meals throughout the day',
            'Include healthy fats like nuts, seeds, and avocados',
            'Consider protein shakes if struggling to meet protein needs',
            'Combine with strength training to build muscle'
        ];
        
        tipsContainer.innerHTML = `
            <h5>${isWeightLoss ? 'Weight Loss' : 'Weight Gain'} Tips</h5>
            <ul>
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
        
        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Calculate daily nutrition goals
    function calculateNutritionGoals(currentWeight, targetWeight, activityLevel, isWeightLoss) {
        // Calculate BMR using Mifflin-St Jeor Equation
        const age = 30; // Default age, can be made configurable
        const height = 170; // Default height in cm, can be made configurable
        const isMale = true; // Default gender, can be made configurable
        
        let bmr;
        if (isMale) {
            bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE based on activity level
        const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
        const tdee = bmr * activityMultipliers[activityLevel - 1];
        
        // Adjust calories based on goal (deficit for weight loss, surplus for weight gain)
        const calorieAdjustment = isWeightLoss ? -500 : 500; // 500 kcal deficit/surplus per day
        const dailyCalories = Math.round(tdee + calorieAdjustment);
        
        // Macronutrient distribution (40% carbs, 30% protein, 30% fat)
        const proteinGrams = Math.round((dailyCalories * 0.3) / 4); // 4 kcal per gram
        const fatGrams = Math.round((dailyCalories * 0.3) / 9); // 9 kcal per gram
        const carbGrams = Math.round((dailyCalories * 0.4) / 4); // 4 kcal per gram
        
        // Update UI
        document.getElementById('dailyCalories').textContent = `${dailyCalories} kcal`;
        document.getElementById('dailyProtein').textContent = `${proteinGrams}g`;
        document.getElementById('dailyCarbs').textContent = `${carbGrams}g`;
        document.getElementById('dailyFats').textContent = `${fatGrams}g`;
        
        // Store values for Telegram sharing
        window.weightPredictionData = {
            currentWeight,
            targetWeight,
            dailyCalories,
            proteinGrams,
            carbGrams,
            fatGrams,
            isWeightLoss,
            projectedDate: new Date()
        };
    }

    // Add diet tips based on goal
    function addDietTips(isWeightLoss) {
        const tipsContainer = document.getElementById('dietTips');
        
        const tips = isWeightLoss ? [
            'Focus on protein-rich foods to maintain muscle mass',
            'Include plenty of fiber to stay full longer',
            'Drink water before meals to reduce calorie intake',
            'Limit added sugars and processed foods',
            'Engage in regular physical activity'
        ] : [
            'Eat calorie-dense, nutrient-rich foods',
            'Incorporate protein with every meal',
            'Have healthy snacks between meals',
            'Consider weight training to build muscle',
            'Don\'t skip meals'
        ];
        
        tipsContainer.innerHTML = `
            <h4>${isWeightLoss ? 'Weight Loss' : 'Weight Gain'} Tips</h4>
            <ul>
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
    }

    // Share to Telegram
    async function shareOnTelegram() {
        const chatId = document.getElementById('telegramChatId').value.trim();
        
        if (!chatId) {
            showStatus('Please enter your Telegram Chat ID', 'error');
            return;
        }
        
        try {
            showStatus('Capturing your progress...', 'loading');
            
            // Use html2canvas to capture the weight prediction section
            const element = document.getElementById('weightPredictionResult');
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            // Convert canvas to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            
            // Create form data
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'bharatbites-progress.png');
            formData.append('caption', '📊 My BharatBites Progress Tracker');
            
            // Show sending status
            showStatus('Sending to Telegram...', 'loading');
            
            // Send to Telegram
            const response = await fetch(TELEGRAM_API, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.ok) {
                showStatus('Successfully shared to Telegram!', 'success');
            } else {
                throw new Error(result.description || 'Failed to send to Telegram');
            }
        } catch (error) {
            console.error('Error sharing to Telegram:', error);
            showStatus(`Error: ${error.message}`, 'error');
            
            // Fallback to download
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bharatbites-progress.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showStatus('Failed to send to Telegram. Image downloaded instead.', 'error');
            }
        }
    }

    // Download image
    function downloadImage() {
        const element = document.getElementById('weightPredictionResult');
        
        html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'bharatbites-progress.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    // Show status message
    function showStatus(message, type = 'info') {
        const statusEl = document.getElementById('telegramStatus');
        const statusText = statusEl.querySelector('.status-text');
        
        // Reset classes
        statusEl.className = 'telegram-status';
        statusEl.classList.add(type);
        
        // Update content
        statusText.textContent = message;
        
        // Auto-hide after 5 seconds if not loading
        if (type !== 'loading') {
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        } else {
            statusEl.style.display = 'flex';
        }
    }

    // Event Listeners
    if (calculateWeightGoalBtn) {
        calculateWeightGoalBtn.addEventListener('click', calculateWeightPrediction);
    }

    if (shareToTelegramBtn) {
        shareToTelegramBtn.addEventListener('click', shareOnTelegram);
    }

    if (downloadImageBtn) {
        downloadImageBtn.addEventListener('click', downloadImage);
    }

    // Initialize with saved chat ID if available
    const savedChatId = localStorage.getItem('telegramChatId');
    if (savedChatId) {
        document.getElementById('telegramChatId').value = savedChatId;
    }

    // Save chat ID when changed
    document.getElementById('telegramChatId')?.addEventListener('change', function() {
        localStorage.setItem('telegramChatId', this.value);
    });

    // ... (rest of the code remains the same)
});