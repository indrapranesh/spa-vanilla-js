import { ROUTES } from "./routes.js";

export default class Router {

    constructor() {
        this.paths = ROUTES;
    }

    initRouter() {
        const pathname = window.location.pathname;
        let params = {};
        const urlSearchParams = new URLSearchParams(window.location.search);
        params = Object.fromEntries(urlSearchParams.entries());
        const URI = pathname === "/" ? "home" : pathname.replace("/", "");
        this.load(URI, params);
    }

    // Load route's template
    load(page = "home", param = {}) {
        const { paths } = this;
        const { path, template } = param?.id ? paths[page](param.id) : paths[page];
        window.history.pushState({}, '', path);
        const rootContainer = document.querySelector("#root");
        rootContainer.innerHTML = template;
    }

}