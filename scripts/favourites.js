import ChatService from "../services/chatService.js";
import Router from '../scripts/router.js';

export class Favourites extends HTMLElement {
    constructor() {
        super();
        this.chatService = new ChatService();
    }

    async connectedCallback() {
        const favourites = await this.chatService.getFavourites();
        const host = document.createElement('div');
        host.id = 'favourite-users';
        host.className = 'd-flex align-center overflow-auto';
        this.appendChild(host);
        const favouritesHtml = favourites.map((favourite) => {
            return `
                <div class="favourite-user d-flex flex-column align-center justify-center mr-4">
                    <div id="favourite-img-wrapper-${favourite.id}">
                        <div class="favourite-img m-1" id="favourite-img-${favourite.id}"></div>
                    </div>
                    <div class="favourites-name pt-1">${favourite.name}</div>
                </div>`
        })
        .join('');
        host.insertAdjacentHTML('afterbegin', favouritesHtml);
    
        favourites.map((favourite) => {
            const imageContainer = document.getElementById(`favourite-img-${favourite.id}`);
            imageContainer.style.backgroundImage = `url(${favourite.avatar})`
            imageContainer.style.cssText = `
                background: url(${favourite.avatar}) center no-repeat;
                background-size: cover;
            `;
            imageContainer.onclick = function() {
                new Router().load('chat', { id: favourite.id});
            }
            if(favourite.unreadMessages > 0) {
                document.getElementById(`favourite-img-wrapper-${favourite.id}`).classList.add('favourite-border');
            }
        })
    }
}
export const registerFavourites = () => window.customElements.define('favourites-list', Favourites);