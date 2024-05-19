import urlObj from "./url.js";
import Users from "./users.js";

const users = new Users();

switch(urlObj.path) {
    case "/":
        users.getUsers();
        break;
    case "/user.html":
        const id = urlObj.query.id;
        users.getUsers(id);
        break;
}