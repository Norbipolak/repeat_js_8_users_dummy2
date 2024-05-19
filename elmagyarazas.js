class UserFetcher {
    constructor(nextBtn) {
        this.nextBtn = nextBtn;
        this.page = 1;
        this.init();
    }

    init() {
        this.next();
        this.getUsers(); // Fetch the initial set of users
    }

    next() {
        if (this.nextBtn === null) 
            return;

        this.nextBtn.addEventListener("click", () => {
            this.page++;
            this.getUsers();
        });
    }

    getUsers() {
        const skip = (this.page - 1) * 24;
        const url = `https://dummyjson.com/users?limit=24&skip=${skip}`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the data
            console.log(data);
            // Update your UI with the fetched users
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
}

// Usage example:
const nextButton = document.getElementById('nextBtn');
const userFetcher = new UserFetcher(nextButton);
