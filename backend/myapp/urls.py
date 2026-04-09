from django.urls import path
from .views import (
    LoginAPI, 
    ContactFormAPI, 
    AppointmentFormAPI, 
    update_appointment_status, 
    get_csrf_token,
    create_user,
    get_dental_data,
    get_users,
    update_user,
    delete_user,
    delete_appointment,
    delete_message
)

urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('contact/', ContactFormAPI.as_view(), name='contact'),
    path('appointment/', AppointmentFormAPI.as_view(), name='appointment'),
    path('messages/', ContactFormAPI.as_view(), name='messages-list'),
    path('appointments/', AppointmentFormAPI.as_view(), name='appointments-list'),
    path('appointments/<int:appointment_id>/status/', update_appointment_status, name='update_appointment_status'),
    path('appointments/<int:appointment_id>/', delete_appointment, name='delete-appointment'),
    path('messages/<int:message_id>/', delete_message, name='delete-message'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    path('users/create/', create_user, name='create_user'),
    path('users/', get_users, name='get_users'),
    path('users/<int:user_id>/', update_user, name='update_user'),
    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),
    path('data/', get_dental_data, name='get_dental_data'),
]