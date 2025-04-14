// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the GitHub username input field on the DOM
    let usernameInput = document.getElementById('usernameInput');
    let repositoryInput = document.getElementById('repositoryInput');
    // Get the value of the GitHub username and repository input fields
    let gitHubUsername = usernameInput.value;
    let githubRepository = repositoryInput.value;

    // se não tiver o nome do repositório, então busca todos os repositórios do usuário
    if (githubRepository === "") {
        requestUserRepos(gitHubUsername)
            .then(response => response.json()) // parse response into json
            .then(data => {
                // update html with data from github
                let ul = document.getElementById('userRepos');
                ul.innerHTML = ''; // limpa resultados anteriores

                // Check if the username was found or not
                if (data.message === "Not Found") {
                    // Create variable that will create li's to be added to ul
                    let li = document.createElement('li');

                    // Add Bootstrap list item class to each li
                    li.classList.add('list-group-item');
                    // Create the html markup for each li
                    li.innerHTML = `
                        <p><strong>No account exists with username:</strong> ${gitHubUsername}</p>
                    `;
                    // Append each li to the ul
                    ul.appendChild(li);
                } else {
                    // Show all repositories
                    for (let i in data) {
                        // Create variable that will create li's to be added to ul
                        let li = document.createElement('li');
                        // Add Bootstrap list item class to each li
                        li.classList.add('list-group-item');
                        // Create the html markup for each li
                        li.innerHTML = `
                            <p><strong>Repo:</strong> ${data[i].name}</p>
                            <p><strong>Description:</strong> ${data[i].description}</p>
                            <p><strong>URL:</strong> <a href="${data[i].html_url}" target="_blank">${data[i].html_url}</a></p>
                        `;
                        // Append each li to the ul
                        ul.appendChild(li);
                    }
                }
            });
    } else {
        // se não, mostra os commits do repositório passado
        requestRepoCommits(gitHubUsername, githubRepository)
            .then(response => response.json()) // parse response into json
            .then(data => {
                let ul = document.getElementById('userRepos');
                ul.innerHTML = ''; // limpa resultados anteriores

                // Check if the repository was found or not
                if (data.message === "Not Found") {
                    let li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = `<p><strong>Repository not found:</strong> ${githubRepository}</p>`;
                    ul.appendChild(li);
                } else {
                    // Show commits of the repository
                    for (let i in data) {
                        let li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.innerHTML = `
                            <p><strong>Commit Message:</strong> ${data[i].commit.message}</p>
                            <p><strong>Date:</strong> ${new Date(data[i].commit.author.date).toLocaleString()}</p>
                        `;
                        ul.appendChild(li);
                    }
                }
            });
    }
});

function requestUserRepos(username) {
    // create a variable to hold the Promise returned from fetch
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

function requestRepoCommits(username, repository) {
    // create a variable to hold the Promise returned from fetch
    return Promise.resolve(fetch(`https://api.github.com/repos/${username}/${repository}/commits`));
}
