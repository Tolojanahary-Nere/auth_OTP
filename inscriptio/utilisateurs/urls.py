from django.urls import path,include
from .views import InscriptionAPIView, ConfirmerCodeAPIView,LoginAPIView,CustomUserViewSet,ResetPasswordAPIView,ConfirmResetPasswordAPIView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router=DefaultRouter()
router.register(r'users',CustomUserViewSet,basename="users")

urlpatterns = [
    path('api/inscription/', InscriptionAPIView.as_view(), name='inscription'),
    path('api/reset-password/', ResetPasswordAPIView.as_view(), name='reset_password'),
    path('api/confirmation/', ConfirmerCodeAPIView.as_view(), name='confirmation'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/reset-password-confirm/', ConfirmResetPasswordAPIView.as_view(), name='reset_password_confirm'),
]
