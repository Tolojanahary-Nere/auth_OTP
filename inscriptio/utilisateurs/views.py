from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer
from twilio.rest import Client
import random

def generer_code_confirmation():
    return str(random.randint(100000, 999999))

class InscriptionAPIView(APIView):
    def post(self, request):
        telephone = request.data.get('telephone')
        username = request.data.get('username')
        password = request.data.get('password')

       
        code = generer_code_confirmation()
        user = CustomUser.objects.create_user(
            username=username,
            telephone=telephone,
            password=password,
            code_confirmation=code
        )

        # Envoyer le code via Twilio
        client = Client('AC678bf7de94e87916002753cfdd50a529','88e73b518a20aab2b80ea5f5089c9c73')
        client.messages.create(
            body=f"Votre code de confirmation est : {code}",
            from_="+12294718698",  # Ton numéro Twilio
           to="+261334827998"
        )

        return Response({"message": "Inscription réussie. Code envoyé par SMS."}, status=status.HTTP_201_CREATED)

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
