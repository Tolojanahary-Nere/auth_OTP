from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    telephone = models.CharField(max_length=15)
    code_confirmation = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    email=models.EmailField(max_length=254)
    # Redéfinition des relations inverses pour éviter les conflits
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",
        blank=True,
        help_text="Les groupes auxquels cet utilisateur appartient.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",
        blank=True,
        help_text="Les permissions spécifiques pour cet utilisateur.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.username

