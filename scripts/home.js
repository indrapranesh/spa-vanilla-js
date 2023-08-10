import ChatService from "../services/chatService.js";

export class Home extends HTMLElement {

    constructor() {
        super();
        this.chatService = new ChatService();
        this.homeContent = '';
        this.timerId;
    }

    async connectedCallback() {
        const host = document.createElement('div');
        host.className = 'home-screen';
        this.appendChild(host);

        this.homeContent = `
            <div id="home-content">
                <div class="favourites">
                    <p class="favourites-header grey-text">Favourites</p>
                    <favourites-list></favourites-list>
                </div>
                <div class="separator pt-3"></div>
                <recent-chats></recent-chats>
            </div>`

        const homeScreenHtml = `
            <div class="action-icons-wrapper d-flex justify-between">
                <img class="action-icon cursor-pointer" src="./assets/icons/back-arrow.svg" />
                <div id="wrap">
                    <input id="search-input" name="search" type="text" placeholder="Search Messages">
                    <div id="search-bar-icon">
                        <img id="search-icon" class="action-icon cursor-pointer" src="./assets/icons/search-icon.svg" />
                    </div>
                </div>
            </div>
            <div class="menu">
                <p class="active menu-item">Messages</p>
                <p class="menu-item">Calls</p>
                <p class="menu-item">Groups</p>
            </div>
            ${this.homeContent}
        `
        host.insertAdjacentHTML('afterbegin', homeScreenHtml);
        this.handleEvents();
    }

    async handleEvents() {
        const searchElement = document.getElementById('search-input');
        const searchBarIcon = document.getElementById('search-bar-icon');
        const searchIcon = '<img id="close-icon" class="action-icon cursor-pointer" src="./assets/icons/search-icon.svg" />';
        const closeIcon= '<img id="close-icon" class="action-icon cursor-pointer" src="./assets/icons/close-icon.svg" />';
        const homeElement = document.getElementById('home-content');

        /**
         * Search element for searching messages 
         * from all chats
         */
        searchElement.onfocus = () => {
            searchElement.style.cssText = ` 
                    width: 250px;
                    z-index: 1;
                    border-bottom: 1px solid #BBB;
                    cursor: text;
            `;
            searchBarIcon.innerHTML = '';
            searchBarIcon.innerHTML = closeIcon;    
            document.getElementById('close-icon').onclick = function() {
                searchElement.style.cssText = ``;
                searchBarIcon.innerHTML = '';
                searchBarIcon.innerHTML = searchIcon;
                searchElement.value = '';
                setHomeElement();
            }
        };
        const setHomeElement = () => {
            homeElement.innerHTML = '';
            homeElement.innerHTML = this.homeContent;
        }
        searchElement.oninput = async(event) => {
            /*
                Adding a throttling of 1000 ms 
                for hitting the search API 
            */
            this.throttleFunction(this.search, 1000);
        }
    }

    setHomeElement = () => {
        const homeElement = document.getElementById('home-content');
        homeElement.innerHTML = '';
        homeElement.innerHTML = this.homeContent;
    }

    search = async() => {
        const searchElement = document.getElementById('search-input');
        const homeElement = document.getElementById('home-content');
        if(searchElement.value.length > 0) {
            let response = await this.chatService.searchMessages(searchElement.value);
            if(response?.length > 0) {
                homeElement.innerHTML = '';
                homeElement.innerHTML = `<search-chats messages=${encodeURIComponent(JSON.stringify(response))}></search-chats>`
            } else {
                homeElement.innerHTML = '';
            }
        } else {
            this.setHomeElement();
        }
    }

    // Throttling function
    throttleFunction  = (func, delay) => {
        if (this.timerId) {
            return
        }
        this.timerId  =  setTimeout(() => {
            func();
            this.timerId  =  undefined;
        }, delay);
    }
}
export const registerHomeScreen = () => window.customElements.define('home-screen', Home);