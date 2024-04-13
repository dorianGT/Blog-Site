"""
URL configuration for blog_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# blog/urls.py

from django.urls import path
from django.conf import settings  # Importez le module settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.blog_index, name="blog_index"),
    path("post/<int:pk>/", views.blog_detail, name="blog_detail"),
    path("category/<category>/", views.blog_category, name="blog_category"),
    path("connexion/", views.connexion, name="blog_connexion"),
    path("inscription/", views.inscription, name="blog_inscription"),
    path("deconnexion/", views.deconnexion, name="blog_deconnexion"),
    path('like/<int:pk>/toggle/', views.toggle_like, name='toggle_like'),
    path('comment/<int:pk>/add/', views.add_comment, name='add_comment'),
    path('create/', views.create_post, name='create_post'),
    path('user_posts/', views.user_posts, name='user_posts'),  # Ajoutez cette ligne pour afficher les posts de l'utilisateur
    path('post/<int:pk>/edit/', views.edit_post, name='edit_post'),  # Ajoutez cette ligne pour modifier le post
    path('post/<int:pk>/delete/', views.delete_post, name='delete_post'),  # Ajoutez cette ligne pour supprimer le post
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
