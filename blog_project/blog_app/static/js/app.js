const savedTheme = localStorage.getItem('theme');
// Set the data-theme
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    
    let logoutLink = document.getElementById('logout-link');

    if (logoutLink !== null) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();  // Empêche le comportement par défaut du lien (redirection)

            // Récupération du token CSRF à partir du cookie
            const csrfToken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];

            // Création de la requête POST avec le token CSRF inclus dans l'en-tête
            fetch(logoutLink.href, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken // Utilisation du token CSRF récupéré
                },
                credentials: 'same-origin'  // Inclut les cookies de session dans la requête
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('La déconnexion a échoué');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la déconnexion:', error);
            });
        });
    }

    let likeButton = document.getElementById('like-button');

    if (likeButton !== null) {
        likeButton.addEventListener('click', function(event) {
            event.preventDefault();  // Empêche le comportement par défaut du bouton

            // Récupération du token CSRF à partir du cookie
            const csrfToken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];

            // Récupération de l'ID du post depuis l'attribut data
            const postId = likeButton.getAttribute('data-post-id');

            // Envoi de la requête POST pour aimer/désaimer le post
            fetch(`/like/${postId}/toggle/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken // Utilisation du token CSRF récupéré
                },
                credentials: 'same-origin'  // Inclut les cookies de session dans la requête
            })
            .then(response => response.json())
            .then(data => {
                if (data.liked) {
                    likeButton.classList.add('liked');
                    likeButton.innerText = 'Unlike';
                } else {
                    likeButton.classList.remove('liked');
                    likeButton.innerText = 'Like';
                }
                document.getElementById('like-count').innerText = data.like_count;
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
        });
    }



    const commentForm = document.querySelector('.comment-form');

    if (commentForm !== null) {
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Prevents the default form behavior
    
            // Retrieve the CSRF token from the form
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            
            // Retrieve the post ID from the data attribute
            const postId = commentForm.querySelector('button').getAttribute('data-post-id');
    
            // Retrieve the comment body from the form
            const formData = new FormData(commentForm);
            const commentBody = formData.get('body');
    
            // Send a POST request to add the comment
            fetch(`/comment/${postId}/add/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken // Include the CSRF token
                },
                body: formData // Send the comment body as form data
            })
            .then(response => response.json())
            .then(data => {
                // Manipuler la réponse si nécessaire
                console.log('Réponse:', data);
            
                // Ajouter le nouveau commentaire à la liste des commentaires existante
                const commentSection = document.querySelector('.comment-section');
                const newCommentContainer = document.createElement('div');
                newCommentContainer.classList.add('comment-container');
                newCommentContainer.innerHTML = `
                    <p class="comment-header">
                        On ${data.created_on} <b>${data.author}</b> wrote:
                    </p>
                    <p class="comment-body" style="word-wrap: break-word;">
                        ${data.body}
                    </p>
                    <hr class="comment-separator">
                `;
                commentSection.appendChild(newCommentContainer);

            
                // Effacer le contenu du formulaire après avoir soumis le commentaire
                commentForm.reset();
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        });
    }
    
    
    
    
    

    






    // Récupère l'élément dropdown-content par son id
    var dropdownContent = document.getElementById("dropdownContent");

    // Récupère l'icône du compte par sa classe
    var accountIcon = document.querySelector('.account_circle');

    // Ajoute un écouteur d'événements au clic sur l'icône du compte
    accountIcon.addEventListener('click', function(event) {
        // Empêche la propagation de l'événement pour éviter la fermeture du menu déroulant immédiatement
        event.stopPropagation();
        
        // Vérifie si le menu déroulant est actuellement affiché ou caché
        if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
            // Affiche le menu déroulant s'il est caché
            dropdownContent.style.display = "block";
        } else {
            // Cache le menu déroulant s'il est affiché
            dropdownContent.style.display = "none";
        }
    });

    // Ajoute un écouteur d'événements au document pour fermer le menu déroulant lors du clic en dehors de celui-ci
    document.addEventListener('click', function(event) {
    // Vérifie si l'élément cliqué n'est pas dans le menu déroulant
    if (!dropdownContent.contains(event.target) && event.target !== accountIcon) {
        // Cache le menu déroulant
        dropdownContent.style.display = "none";
    }
    });

    // Vérifie si l'utilisateur est sur l'une des pages spécifiques
    if (window.location.href.includes('index.html') ||
        window.location.href.includes('contact.html') ||
        window.location.href.includes('news.html')) {
            
        // Sélectionnez tous les éléments avec la classe "nav-link"
        var liens = document.querySelectorAll('.nav-link');

        // Obtenez le nom de la page actuelle à partir de l'URL
        var pageName = window.location.href.split('/').pop(); // Obtient le nom de la page à partir de l'URL

        // Parcourez chaque élément et ajoutez un gestionnaire d'événement "click"
        liens.forEach(function(lien) {
            var href = lien.getAttribute('href');
            lien.classList.remove('active');

            // Vérifiez si le nom de la page correspond à celui du lien
            if (pageName === 'index.html' && href === 'index.html') {
                lien.classList.add('active'); // Ajoutez la classe "active" au lien correspondant à la page d'accueil
            } else if (pageName === 'contact.html' && href === 'contact.html') {
                lien.classList.add('active'); // Ajoutez la classe "active" au lien correspondant à la page de contact
            } else if (pageName === 'news.html' && href === 'news.html') {
                lien.classList.add('active'); // Ajoutez la classe "active" au lien correspondant à la page de news
            }
        });
    } else {
        // Si l'utilisateur n'est pas sur l'une des pages spécifiques, supprimez la classe "active" de tous les liens
        var liens = document.querySelectorAll('.nav-link');
        liens.forEach(function(lien) {
            lien.classList.remove('active');
        });
    }


    if (window.location.href.includes('index.html')) {

        let slideIndex = 0;
        let slideTimeout;
        
        showSlides();
        
        function showSlides() {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            let dots = document.getElementsByClassName("dot");
        
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
            slideIndex++;
            if (slideIndex > slides.length) {slideIndex = 1}    
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex-1].style.display = "block";  
            dots[slideIndex-1].className += " active";
            slideTimeout = setTimeout(showSlides, 4000); // Change image every 4 seconds
        }
        
        function ShowSlide(index){
            slideIndex = index;
        
            let slides = document.getElementsByClassName("mySlides");
            let dots = document.getElementsByClassName("dot");
        
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
        
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
        
            slides[slideIndex].style.display = "block";  
            dots[slideIndex].className += " active";
        
            // Arrête le défilement automatique
            clearTimeout(slideTimeout);
            // Redémarre le défilement automatique après 4 secondes
            slideTimeout = setTimeout(showSlides);
        }
        
        // Ajoute un gestionnaire d'événements à chaque dot
        let dots = document.getElementsByClassName("dot");
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener("click", function() {
                ShowSlide(i);
            });
        }
    }

    
    const darkModeToggle = document.getElementById('darkmode-toggle');
    const body = document.body;
    
    // Fonction pour activer le thème sombre
    function enableDarkMode() {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Fonction pour activer le thème clair
    function enableLightMode() {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    
    // Fonction pour basculer entre les thèmes
    function toggleTheme() {
        if (darkModeToggle.checked) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
    
    // Écoute les changements d'état de la bascule
    darkModeToggle.addEventListener('change', toggleTheme);
    
    // Vérifie le thème stocké localement lors du chargement de la page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            darkModeToggle.checked = true;
        }
    }
});