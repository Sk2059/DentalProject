from rest_framework import serializers
from .models import ContactForm, AppointmentForm
from django.contrib.auth.models import User

class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = '__all__'

class AppointmentFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentForm
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'date_joined')