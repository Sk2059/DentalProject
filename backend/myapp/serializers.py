from rest_framework import serializers
from .models import ContactForm, AppointmentForm, Service, TeamMember
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


class ServiceSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")

    class Meta:
        model = Service
        fields = (
            "id",
            "title",
            "name",
            "description",
            "icon",
            "price",
            "image",
            "is_featured",
            "display_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class TeamMemberSerializer(serializers.ModelSerializer):
    seniority = serializers.IntegerField(source="display_order", required=False)

    class Meta:
        model = TeamMember
        fields = (
            "id",
            "name",
            "role",
            "bio",
            "experience",
            "specialization",
            "image",
            "is_featured",
            "display_order",
            "seniority",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")