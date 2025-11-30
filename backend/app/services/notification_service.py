import logging
from app import db
from app.models.user import Guardian

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def notify_guardians(user_id, health_log):
        """Notify guardians about user's health status"""
        try:
            guardians = Guardian.query.filter_by(user_id=user_id).all()
            
            if not guardians:
                logger.info(f"No guardians found for user {user_id}")
                return False
            
            message = f"Health update: User is feeling {health_log.general_feeling}. "
            if health_log.symptoms:
                message += f"Symptoms: {', '.join(health_log.symptoms)}. "
            message += "Please check on them."
            
            for guardian in guardians:
                NotificationService.send_sms(guardian.phone, message)
                if guardian.email:
                    NotificationService.send_email(guardian.email, message)
            
            logger.info(f"Notified {len(guardians)} guardians for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error notifying guardians: {e}")
            return False
    
    @staticmethod
    def notify_crisis_alert(user_id, crisis_event):
        """Send emergency alerts to guardians during crisis"""
        try:
            guardians = Guardian.query.filter_by(user_id=user_id).all()
            
            message = f"🚨 CRISIS ALERT: User reported severe pain (level {crisis_event.pain_level}/10). "
            message += f"Symptoms: {', '.join(crisis_event.symptoms)}. "
            message += "Immediate attention required!"
            
            for guardian in guardians:
                NotificationService.send_sms(guardian.phone, message)
                if guardian.email:
                    NotificationService.send_email(guardian.email, "CRISIS ALERT", message)
            
            logger.info(f"Sent crisis alerts to {len(guardians)} guardians")
            return True
            
        except Exception as e:
            logger.error(f"Error sending crisis alerts: {e}")
            return False
    
    @staticmethod
    def send_sms(phone_number, message):
        """Send SMS notification - integrate with SMS service like Twilio"""
        # Implementation for SMS service would go here
        logger.info(f"SMS to {phone_number}: {message}")
        return True
    
    @staticmethod
    def send_email(email, subject, message):
        """Send email notification - integrate with email service"""
        # Implementation for email service would go here
        logger.info(f"Email to {email}: {subject} - {message}")
        return True
    
    @staticmethod
    def send_test_notification(user_id):
        """Send test notification to verify setup"""
        try:
            guardians = Guardian.query.filter_by(user_id=user_id).all()
            
            message = "Test notification from Sickle Cell Early Warning System. " \
                     "This confirms your notification settings are working correctly."
            
            for guardian in guardians:
                NotificationService.send_sms(guardian.phone, message)
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending test notification: {e}")
            return False