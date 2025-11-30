class RecommendationService:
    @staticmethod
    def generate_recommendations(prediction, health_log):
        """Generate personalized recommendations based on risk and symptoms"""
        recommendations = []
        risk_level = prediction['risk_level']
        
        # Base recommendations for all risk levels
        recommendations.append("Drink plenty of water throughout the day")
        recommendations.append("Avoid extreme temperatures")
        
        # Risk-specific recommendations
        if risk_level == 'high':
            recommendations.extend([
                "Seek medical attention immediately",
                "Take prescribed pain medication",
                "Rest in a comfortable position",
                "Monitor symptoms closely",
                "Notify your caregiver or family member"
            ])
        elif risk_level == 'medium':
            recommendations.extend([
                "Increase fluid intake",
                "Avoid strenuous activities",
                "Rest and monitor symptoms",
                "Take medications as prescribed",
                "Keep warm if feeling cold"
            ])
        
        # Symptom-specific recommendations
        symptoms = health_log.symptoms or []
        if 'chest_pain' in symptoms or 'shortness_of_breath' in symptoms:
            recommendations.append("⚠️ Chest symptoms detected - seek urgent medical care")
        
        if 'joint_pains' in symptoms or 'back_pain' in symptoms:
            recommendations.append("Apply warm compresses to painful areas")
        
        if health_log.water_intake in ['0-1_cups', '2-3_cups']:
            recommendations.append("🚰 You're not drinking enough water - aim for 6+ cups daily")
        
        if health_log.temperature_feeling == 'cold' or health_log.temperature_exposure == 'yes_cold':
            recommendations.append("❄️ Keep warm - cold exposure can trigger crises")
        
        if health_log.medication_taken == 'missed':
            recommendations.append("💊 Take your missed medication as soon as possible")
        
        return recommendations