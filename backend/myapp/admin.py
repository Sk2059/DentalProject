from django.contrib import admin
from .models import ContactForm, AppointmentForm, Service, TeamMember

@admin.register(AppointmentForm)
class AppointmentFormAdmin(admin.ModelAdmin):
    list_display = ('firstName', 'lastName', 'service', 'preferredDate', 'preferredTime', 'status', 'created_at')
    list_filter = ('status', 'service', 'preferredDate')
    search_fields = ('firstName', 'lastName', 'email', 'phone')
    ordering = ('-preferredDate', 'preferredTime')

admin.site.register(ContactForm)
admin.site.register(Service)
admin.site.register(TeamMember)
