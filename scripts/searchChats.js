import ChatService from "../services/chatService.js";
import Router from "./router.js";

export class SearchChats extends HTMLElement {

    constructor() {
        super();
        this.chatService = new ChatService();
        this.router = new Router();
    }

    static get observedAttributes() {
        return [`messages`];
    }

    async connectedCallback() {
        const messages = JSON.parse(decodeURIComponent(this.getAttribute('messages')))
        const host = document.createElement('div');
        host.id = 'search-chats';
        host.className = 'search-chats-container';
        this.appendChild(host);
        const searchChatsHtml = messages.map((message, index) => {
            const latestMsgTime = this.getMessageTime(message.time);
            return `
                <div class="recent-chat-contact d-flex align-center justify-between py-4" id="recent-chat-contact-${message.id}">
                    <div class="d-flex align-center">
                        <div class="d-flex flex-column justify-end pl-3">
                            <div class="recent-chat-contact-name">${message.name}</div>
                            <div class="recent-chat-latest-msg grey-text pt-1">${message.message}</div>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-end justify-end">
                        <div class="recent-chat-timing id="recent-chat-timing-${message.id}">${latestMsgTime}</div>
                    </div>
                </div>
                ${messages.length === index + 1 ? '': '<div class="recent-chat-separator mx-5"></div>'}`
        })
        .join('');
        if (messages?.length === 0) {
            searchChatsHtml = '';
        }
        host.insertAdjacentHTML('afterbegin', searchChatsHtml);
    }

    getMessageTime(date) {
        const currentTiming = new Date(Date.now());
        const latestMessageTime = new Date(date);
        if(currentTiming.getDate() === latestMessageTime.getDate()) {
            return `${latestMessageTime.getHours()}:${latestMessageTime.toLocaleString('en-us', { minute: '2-digit' })}`;
        } else {
            return `${latestMessageTime.getDate()}/${latestMessageTime.getMonth()+1}/${latestMessageTime.getFullYear().toString().substr(-2)}`
        }
    }

}
export const registerSearchChats = () => window.customElements.define('search-chats', SearchChats);