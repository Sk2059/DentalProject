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


class Service(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    icon = models.CharField(max_length=30, default="🦷")
    price = models.CharField(max_length=100)
    image = models.ImageField(upload_to="services/", null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["display_order", "-created_at"]


class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    bio = models.TextField()
    experience = models.CharField(max_length=60, blank=True)
    specialization = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to="team/", null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["display_order", "-created_at"]
