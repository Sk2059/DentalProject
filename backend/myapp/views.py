from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import ContactFormSerializer, AppointmentFormSerializer, UserSerializer
from .models import ContactForm, AppointmentForm
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.db import IntegrityError

from rest_framework.authentication import TokenAuthentication

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPI(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        print(f"Login attempt for username: {username}")

        # Validate required fields
        if not username or not password:
            print("Missing username or password")
            return Response({
                'message': 'Please provide both username and password',
                'errors': {
                    'username': 'Username is required' if not username else None,
                    'password': 'Password is required' if not password else None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try to authenticate first
            user = authenticate(username=username, password=password)
            print(f"Authentication result for {username}: {'Success' if user else 'Failed'}")

            if user is None:
                print(f"Authentication failed for {username}")
                return Response({
                    'message': 'Invalid credentials',
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Check if user is staff
            if not user.is_staff:
                print(f"User {username} is not staff")
                return Response({
                    'message': 'Access denied: This account does not have admin privileges',
                }, status=status.HTTP_403_FORBIDDEN)

            # Login successful
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            print(f"Login successful for staff user: {username}")

            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'is_staff': user.is_staff
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Unexpected error during login: {str(e)}")
            return Response({
                'message': 'An error occurred during login',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ContactFormAPI(APIView):
    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Form submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        messages = ContactForm.objects.all().order_by('-Message_date')
        serializer = ContactFormSerializer(messages, many=True)
        return Response(serializer.data)

class AppointmentFormAPI(APIView):
    def post(self, request):
        serializer = AppointmentFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Appointment booked successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        appointments = AppointmentForm.objects.all().order_by('-preferredDate', 'preferredTime')
        serializer = AppointmentFormSerializer(appointments, many=True)
        return Response(serializer.data)

@api_view(['PATCH'])
def update_appointment_status(request, appointment_id):
    try:
        appointment = AppointmentForm.objects.get(id=appointment_id)
        appointment.status = request.data.get('status', appointment.status)
        appointment.save()
        serializer = AppointmentFormSerializer(appointment)
        return Response(serializer.data)
    except AppointmentForm.DoesNotExist:
        return Response(
            {'error': 'Appointment not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_csrf_token(request):
    """
    Endpoint to get CSRF token
    """
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_user(request):
    """
    Create a new user (admin only)
    """
    try:
        # Extract data from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        is_staff = request.data.get('is_staff', True)  # Default to True since this is for admin panel

        # Validate required fields
        if not all([username, email, password]):
            return Response({
                'message': 'Please provide username, email and password',
                'errors': {
                    'username': 'Username is required' if not username else None,
                    'email': 'Email is required' if not email else None,
                    'password': 'Password is required' if not password else None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate username uniqueness
        if User.objects.filter(username=username).exists():
            return Response({
                'message': 'Username already exists',
                'errors': {
                    'username': 'This username is already taken'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate email uniqueness
        if User.objects.filter(email=email).exists():
            return Response({
                'message': 'Email already exists',
                'errors': {
                    'email': 'This email is already registered'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create the user with staff status
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.is_staff = True  # Explicitly set staff status
        user.save()

        # Create token for the new user
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'token': token.key  # Include token in response
            }
        }, status=status.HTTP_201_CREATED)

    except IntegrityError as e:
        return Response({
            'message': 'Database integrity error',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'message': 'An unexpected error occurred',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_dental_data(request):
    """
    Get dental services and stats data
    """
    services = [
        {
            "title": "General Dentistry",
            "description": "Comprehensive dental care including cleanings, fillings, and preventive treatments for the whole family.",
            "icon": "🦷",
            "features": ["Regular Cleanings", "Cavity Fillings", "Root Canal Treatment", "Dental Crowns"],
            "price": "Starting from Rs. 2,000"
        },
        {
            "title": "Cosmetic Dentistry",
            "description": "Transform your smile with our advanced cosmetic procedures and treatments.",
            "icon": "✨",
            "features": ["Teeth Whitening", "Veneers", "Dental Bonding", "Smile Makeover"],
            "price": "Starting from Rs. 15,000"
        },
        {
            "title": "Orthodontics",
            "description": "Straighten your teeth with traditional braces or modern clear aligners.",
            "icon": "🔧",
            "features": ["Metal Braces", "Clear Aligners", "Retainers", "Bite Correction"],
            "price": "Starting from Rs. 80,000"
        },
        {
            "title": "Oral Surgery",
            "description": "Advanced surgical procedures performed by our experienced oral surgeons.",
            "icon": "🏥",
            "features": ["Tooth Extraction", "Wisdom Teeth Removal", "Dental Implants", "Jaw Surgery"],
            "price": "Starting from Rs. 10,000"
        },
        {
            "title": "Pediatric Dentistry",
            "description": "Specialized dental care for children in a friendly and comfortable environment.",
            "icon": "👶",
            "features": ["Children's Cleanings", "Fluoride Treatments", "Dental Sealants", "Cavity Prevention"],
            "price": "Starting from Rs. 1,500"
        },
        {
            "title": "Emergency Dental Care",
            "description": "24/7 emergency dental services for urgent dental problems and pain relief.",
            "icon": "🚨",
            "features": ["Emergency Extractions", "Pain Management", "Trauma Treatment", "After-hours Care"],
            "price": "Starting from Rs. 3,000"
        }
    ]

    stats = [
        {"icon": "Users", "value": "5000+", "label": "Happy Patients"},
        {"icon": "Award", "value": "15+", "label": "Years Experience"},
        {"icon": "Star", "value": "4.9", "label": "Average Rating"},
        {"icon": "Clock", "value": "24/7", "label": "Emergency Care"}
    ]

    return Response({
        'services': services,
        'stats': stats
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_users(request):
    """
    Get list of all users (admin only)
    """
    try:
        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': 'An error occurred while fetching users',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, user_id):
    """
    Update a user (admin only)
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Don't allow modifying superuser status through API
        if not request.user.is_superuser and user.is_superuser:
            return Response({
                'message': 'Cannot modify a superuser account',
            }, status=status.HTTP_403_FORBIDDEN)

        # Update fields
        username = request.data.get('username')
        email = request.data.get('email')
        is_staff = request.data.get('is_staff')
        password = request.data.get('password')

        # Validate username uniqueness if changed
        if username and username != user.username:
            if User.objects.filter(username=username).exists():
                return Response({
                    'message': 'Username already exists',
                    'errors': {'username': 'This username is already taken'}
                }, status=status.HTTP_400_BAD_REQUEST)
            user.username = username

        # Validate email uniqueness if changed
        if email and email != user.email:
            if User.objects.filter(email=email).exists():
                return Response({
                    'message': 'Email already exists',
                    'errors': {'email': 'This email is already registered'}
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = email

        # Update password if provided
        if password:
            user.set_password(password)

        # Update staff status if provided
        if is_staff is not None:
            user.is_staff = is_staff

        user.save()
        serializer = UserSerializer(user)
        
        return Response({
            'message': 'User updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': 'An error occurred while updating user',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    """
    Delete a user (admin only)
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Don't allow deleting superuser through API
        if user.is_superuser:
            return Response({
                'message': 'Cannot delete a superuser account',
            }, status=status.HTTP_403_FORBIDDEN)

        # Don't allow self-deletion
        if user.id == request.user.id:
            return Response({
                'message': 'Cannot delete your own account',
            }, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({
            'message': 'User deleted successfully'
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': 'An error occurred while deleting user',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_appointment(request, appointment_id):
    """
    Delete an appointment (admin only)
    """
    try:
        appointment = AppointmentForm.objects.get(id=appointment_id)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except AppointmentForm.DoesNotExist:
        return Response(
            {'error': 'Appointment not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({
            'message': 'An error occurred while deleting the appointment',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_message(request, message_id):
    """
    Delete a message (admin only)
    """
    try:
        message = ContactForm.objects.get(id=message_id)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ContactForm.DoesNotExist:
        return Response(
            {'error': 'Message not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({
            'message': 'An error occurred while deleting the message',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
