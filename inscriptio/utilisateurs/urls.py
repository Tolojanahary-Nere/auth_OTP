from django.urls import path
from .views import InscriptionAPIView, ConfirmerCodeAPIView

urlpatterns = [
    path('inscription/', InscriptionAPIView.as_view(), name='inscription'),
    path('confirmation/', ConfirmerCodeAPIView.as_view(), name='confirmation'),
]
