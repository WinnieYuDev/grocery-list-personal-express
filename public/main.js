const messages = document.querySelectorAll('.message span'); // now includes completed too
const trash = document.querySelectorAll('.fa-trash');

// Toggle completed on click
messages.forEach(span => {
    span.addEventListener('click', () => {
        const id = span.dataset.id;
        const completed = span.classList.contains('completed');

        fetch('/messages/complete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed: !completed })
        })
        .then(res => res.json())
        .then(() => window.location.reload());
    });
});

// Delete item

trash.forEach(icon => {
    icon.addEventListener('click', () => {
        const id = icon.dataset.id;

        fetch('/messages', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })  // Must match server's expected key
        })
        .then(res => res.json())
        .then(() => window.location.reload())
        .catch(err => console.error(err));
    });
});

//Citations:
//Modified code from youtube tutorial: https://www.youtube.com/watch?v=jZ-kmmgi_d0&list=PLBf-QcbaigsJysJ-KFZvLGJvvW-3sfk1S&index=42
//Reference code from https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial#setting-up-the-project
//Use of dotenv package to hide sensitive info: https://www.npmjs.com/package/dotenv
//Use of Learning Mode on AI Tools to help with code structure,syntax and debugging