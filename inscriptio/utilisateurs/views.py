from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer
from twilio.rest import Client
import random
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from decouple import config
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
import smtplib
from email.mime.text import MIMEText
from decouple import config
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
 


def generer_code_confirmation():
    return str(random.randint(100000, 999999))


def envoyer_email(email, code):
    try:
        # Configuration du serveur SMTP
        smtp_host = config('EMAIL_HOST')
        smtp_port = config('EMAIL_PORT')
        smtp_user = config('EMAIL_HOST_USER')
        smtp_password = config('EMAIL_HOST_PASSWORD')

        # Préparation du message
        sujet = "Votre code de confirmation"
        corps = f"Bonjour,\n\nVotre code de confirmation est : {code}\n\nMerci."
        message = MIMEText(corps)
        message['Subject'] = sujet
        message['From'] = smtp_user
        message['To'] = email

        # Envoi de l'email
        serveur = smtplib.SMTP(smtp_host, smtp_port)
        serveur.starttls()  # Sécuriser la connexion
        serveur.login(smtp_user, smtp_password)
        serveur.sendmail(smtp_user, email, message.as_string())
        serveur.quit()

        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email : {e}")
        return False


class InscriptionAPIView(APIView):
    def post(self, request):
        telephone = request.data.get('telephone')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        preference = request.data.get('preference')  # 'sms' ou 'email'

        if preference not in ['sms', 'email']:
            return Response({"message": "Préférence invalide."}, status=status.HTTP_400_BAD_REQUEST)

        # Générer le code de confirmation
        code = generer_code_confirmation()

        # Créer l'utilisateur
        try:
            user = CustomUser.objects.create_user(
                username=username,
                telephone=telephone,
                email=email,
                password=password,
                code_confirmation=code
            )
        except Exception as e:
            return Response({"message": f"Erreur lors de la création de l'utilisateur : {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Envoyer le code de confirmation selon la préférence
        if preference == 'sms':
            client = Client(
                config('TWILIO_ACCOUNT_SID'),  # SID Twilio
                config('TWILIO_AUTH_TOKEN')    # Token Twilio
            )
            try:
                client.messages.create(
                    body=f"Votre code de confirmation est : {code}",
                    from_=config('TWILIO_PHONE_NUMBER'),
                    to="+261334827998"
                )
            except Exception as e:
                return Response({"message": f"Erreur lors de l'envoi du SMS : {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif preference == 'email':
            if not envoyer_email(email, code):
                return Response({"message": "Erreur lors de l'envoi de l'email."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"message": "Inscription réussie. Code envoyé par votre méthode préférée."},
            status=status.HTTP_201_CREATED
        )


class ConfirmerCodeAPIView(APIView):
    def post(self, request):
        telephone = request.data.get('telephone')
        code = request.data.get('code')

        try:
            user = CustomUser.objects.get(telephone=telephone, code_confirmation=code)
            user.is_verified = True
            user.code_confirmation = None
            user.save()
            return Response({"message": "Utilisateur vérifié avec succès."}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "Code incorrect ou utilisateur introuvable."}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Vérifier si le nom d'utilisateur et le mot de passe sont fournis
        if not username or not password:
            return Response(
                {"message": "Nom d'utilisateur et mot de passe sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Récupérer l'utilisateur à partir du nom d'utilisateur
            user = User.objects.get(username=username)

            # Vérifier si le mot de passe correspond
            if not user.check_password(password):
                return Response(
                    {"message": "Mot de passe incorrect."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Vérifier si l'utilisateur a confirmé son compte
            if user.is_verified:
                # Génère ou récupère un jeton d'authentification
                token, _ = Token.objects.get_or_create(user=user)
                return Response(
                    {
                        "message": "Connexion réussie.",
                        "token": token.key,  # Jeton d'authentification
                        "user": {
                            "id": user.id,
                            "username": user.username
                        }
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Votre compte n'est pas vérifié."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        except User.DoesNotExist:
            return Response(
                {"message": "Nom d'utilisateur incorrect."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsAuthenticated]  # Restreint l'accès aux utilisateurs authentifiés
    permission_classes = []  # Désactive les permissions pour tous

    def perform_update(self, serializer):
        # Logique supplémentaire avant la mise à jour
        instance = serializer.save()
        print(f"Utilisateur {instance.username} mis à jour.")


class ResetPasswordAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"message": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Vérifier si l'utilisateur existe avec cet email
            user = CustomUser.objects.get(email=email)

            # Générer un token pour la réinitialisation
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{config('FRONTEND_URL')}/reset-password/{uid}/{token}"

            # Envoyer l'email avec le lien de réinitialisation
            send_mail(
                "Réinitialisation de votre mot de passe",
                f"Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : {reset_url}",
                config('EMAIL_HOST_USER'),
                [email],
                fail_silently=False,
            )

            return Response(
                {"message": "Lien de réinitialisation envoyé à votre email."},
                status=status.HTTP_200_OK,
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"message": "Aucun utilisateur trouvé avec cet email."},
                status=status.HTTP_404_NOT_FOUND,
            )

class ConfirmResetPasswordAPIView(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = CustomUser.objects.get(pk=user_id)

            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                return Response({"message": "Lien de réinitialisation invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)

        except (CustomUser.DoesNotExist, ValueError, TypeError):
            return Response({"message": "Lien invalide."}, status=status.HTTP_400_BAD_REQUEST)
