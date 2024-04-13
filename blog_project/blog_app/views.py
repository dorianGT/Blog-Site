# blog/views.py

from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect,get_object_or_404
from .models import Post, Comment
from .forms import CommentForm,PostForm
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout

def blog_index(request):
    posts = Post.objects.all().order_by("-created_on")
    context = {
        "posts": posts,
    }
    return render(request, "blog/index.html", context)

def blog_category(request, category):
    posts = Post.objects.filter(
        categories__name__contains=category
    ).order_by("-created_on")
    context = {
        "category": category,
        "posts": posts,
    }
    return render(request, "blog/category.html", context)

def blog_detail(request, pk):
    post = Post.objects.get(pk=pk)
    # form = CommentForm()
    # if request.method == "POST":
    #     form = CommentForm(request.POST)
    #     if form.is_valid():
    #         comment = Comment(
    #             author=request.user.username,
    #             body=form.cleaned_data["body"],
    #             post=post,
    #         )
    #         comment.save()
    #         return 

    comments = Comment.objects.filter(post=post)
    context = {
        "post": post,
        "comments": comments,
        "form": CommentForm(),
    }
    return render(request, "blog/detail.html", context)

def inscription(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('blog_index')  # Redirige vers la page d'accueil après inscription
    else:
        form = UserCreationForm()
    return render(request, 'blog/inscription.html', {'form': form})

def connexion(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('blog_index')  # Redirige vers la page d'accueil après connexion
    else:
        form = AuthenticationForm()
    return render(request, 'blog/connexion.html', {'form': form})

def deconnexion(request):
    logout(request)
    return redirect('blog_index')  # Redirige vers la page d'accueil après déconnexion

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def like_post(request, pk):
    post = Post.objects.get(pk=pk)
    if request.method == 'POST':
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            liked = False
        else:
            post.likes.add(request.user)
            liked = True
        return JsonResponse({'liked': liked})
    
def toggle_like(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        if request.user.is_authenticated:
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                liked = False
            else:
                post.likes.add(request.user)
                liked = True
            like_count = post.likes.count()
            return JsonResponse({'liked': liked, 'like_count': like_count})
        else:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

import logging

logger = logging.getLogger(__name__)
from django.utils import timezone

@login_required
def add_comment(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.author = request.user
            comment.save()
            # Formater la date avant de la retourner
            formatted_date = comment.created_on.strftime("%B %d, %Y")  # Formatage de la date
            return JsonResponse({
                'success': 'Comment added successfully',
                'created_on': formatted_date,
                'author': comment.author.username,  # Renvoyer le nom de l'auteur du commentaire
                'body': comment.body,  # Renvoyer le contenu du commentaire
            })
        else:
            print("Form is not valid:", form.errors)
            return JsonResponse({'error': form.errors}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user  # Si vous avez un champ d'auteur dans votre modèle Post
            post.save()
            form.save_m2m()  # Sauvegarder les relations ManyToMany (les catégories)
            return redirect('blog_detail', pk=post.pk)  # Rediriger vers la page de détail du post
    else:
        form = PostForm()
    return render(request, 'blog/create_post.html', {'form': form})


@login_required
def user_posts(request):
    user_posts = Post.objects.filter(author=request.user).order_by('-created_on')
    return render(request, 'blog/user_posts.html', {'user_posts': user_posts})

@login_required
def edit_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            return redirect('user_posts')
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/edit_post.html', {'form': form})

@login_required
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        post.delete()
        return redirect('user_posts')
    else:
        user_posts = Post.objects.filter(author=request.user).order_by('-created_on')
        return render(request, 'blog/user_posts.html', {'user_posts': user_posts})