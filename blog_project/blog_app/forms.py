# blog/forms.py

from django import forms
from .models import Comment,Post,Category  # Import the Comment model

class CommentForm(forms.ModelForm):  # Change to ModelForm
    class Meta:
        model = Comment
        fields = ['body']  # Specify the fields to include in the form
        widgets = {
            'body': forms.Textarea(attrs={"class": "form-control", "placeholder": "Leave a comment!"})
        }

class PostForm(forms.ModelForm):
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all())

    class Meta:
        model = Post
        fields = ['title', 'body', 'image', 'categories']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['image'].required = True
        self.fields['image'].widget.attrs['required'] = 'required'

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if not image:
            raise forms.ValidationError("Veuillez sélectionner une image.")
        return image
