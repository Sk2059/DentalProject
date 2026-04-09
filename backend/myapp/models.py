from django.db import models

class ContactForm(models.Model):
    Name = models.CharField(max_length=100)
    Email = models.EmailField()
    Phone = models.CharField(max_length=10)
    Subject = models.CharField(max_length=100)
    Message = models.TextField()
    Message_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Name


class AppointmentForm(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)  # Increased length for international format
    service = models.CharField(max_length=100)
    preferredDate = models.DateField()
    preferredTime = models.CharField(max_length=10)  # For storing time slots like "9:00 AM"
    message = models.TextField(blank=True, null=True)  # Optional field
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed')
        ],
        default='pending'
    )

    def __str__(self):
        return f"{self.firstName} {self.lastName} - {self.preferredDate} {self.preferredTime}"

    class Meta:
        ordering = ['-preferredDate', 'preferredTime']  # Sort by date (newest first) and then time
 
    
    
