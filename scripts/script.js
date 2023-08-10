import { registerFavourites } from "./favourites.js";
import { registerHomeScreen } from "./home.js";
import { registerRecentChats } from "./recentChats.js";
import { registerChatScreen } from "./chat.js";
import Router from "./router.js";
import { registerSearchChats } from "./searchChats.js";

const ROUTER = new Router();
ROUTER.initRouter();

// Handle browser navigation 
window.addEventListener('popstate', function () {
    const pathname = this.window.location.pathname;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const URI = pathname === "/" ? "home" : pathname.replace("/", "");
    ROUTER.load(URI, params);
});

// Initialize Custom  Components 
const registerCustomElements = () => {
    registerFavourites();
    registerRecentChats();
    registerHomeScreen();
    registerChatScreen();
    registerSearchChats();
}

// Load custom components once dom is loaded
document.addEventListener("DOMContentLoaded", registerCustomElements);