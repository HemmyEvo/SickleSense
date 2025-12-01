class RecommendationService:
    @staticmethod
    def generate_recommendations(prediction, health_log):
        """Generate personalized recommendations based on ML predictions"""
        recommendations = []
        
        # Base recommendations
        recommendations.append("Drink plenty of water throughout the day")
        recommendations.append("Avoid extreme temperatures")
        
        # Pain-type specific recommendations
        pain_type = prediction.get('pain_type', '')
        if 'chest' in str(pain_type).lower():
            recommendations.append("🚨 CHEST PAIN DETECTED - Seek immediate medical attention")
            recommendations.append("Sit upright and try to stay calm")
        
        # Pain intensity based recommendations
        pain_intensity = prediction.get('pain_intensity', 0)
        if pain_intensity >= 7:
            recommendations.extend([
                "Take prescribed pain medication immediately",
                "Rest in a comfortable position",
                "Apply warm compresses to painful areas",
                "Contact your healthcare provider"
            ])
        elif pain_intensity >= 4:
            recommendations.extend([
                "Increase fluid intake",
                "Avoid strenuous activities",
                "Rest and monitor symptoms",
                "Take medications as prescribed"
            ])
        
        # Symptom-specific recommendations
        symptoms = health_log.symptoms or []
        if 'chest_pain' in symptoms or 'shortness_of_breath' in symptoms:
            recommendations.append("⚠️ Chest symptoms detected - urgent care needed")
        
        if 'joint_pains' in symptoms:
            recommendations.append("Apply warm compresses to painful joints")
        
        # Environmental factors
        if health_log.temperature_feeling == 'cold' or health_log.temperature_exposure == 'yes_cold':
            recommendations.append("❄️ Keep warm - cold exposure can trigger crises")
        
        if health_log.water_intake in ['0-1_cups', '2-3_cups']:
            recommendations.append("🚰 Increase water intake to prevent dehydration")
        
        return recommendations