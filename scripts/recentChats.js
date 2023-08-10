import ChatService from "../services/chatService.js";
import Router from "./router.js";

export class RecentChats extends HTMLElement {

    constructor() {
        super();
        this.chatService = new ChatService();
        this.router = new Router();
    }

    async connectedCallback() {
        let chatContacts = await this.chatService.getRecentChats();
        const host = document.createElement('div');
        host.id = 'recent-chats';
        host.className = 'recent-chats-container';
        this.appendChild(host);
        const recentChatsHtml = chatContacts.map((contact, index) => {
            const latestMsgTime = this.getMessageTime(contact.lastMessage.time);
            return `
                <div class="recent-chat-contact d-flex align-center justify-between py-3" id="recent-chat-contact-${contact.id}">
                    <div class="d-flex align-center">
                        <div class="recent-chat-dp" id="recent-chat-dp-${contact.id}"></div>
                        <div class="d-flex flex-column justify-end pl-3">
                            <div class="recent-chat-contact-name">${contact.name}</div>
                            <div class="recent-chat-latest-msg grey-text pt-1">${contact.lastMessage.text}</div>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-end justify-end">
                        <div class="recent-chat-timing ${contact.unreadMessages > 0 ? '': 'grey-text'}" id="recent-chat-timing-${contact.id}">${latestMsgTime}</div>
                        ${contact.unreadMessages > 0 ? 
                            `<div class="recent-chat-unread mt-1">${contact.unreadMessages}</div>` : ''}
                    </div>
                </div>
                ${chatContacts.length === index + 1 ? '': '<div class="recent-chat-separator mx-5"></div>'}`
        })
        .join('');
        host.insertAdjacentHTML('afterbegin', recentChatsHtml);
        
        // Navigate to chat screen
        chatContacts.map((contact) => {
            const recentChatElement = document.getElementById(`recent-chat-contact-${contact.id}`);
            recentChatElement.onclick = function() {
                new Router().load('chat', { id: contact.id});
            }
            const imageContainer = document.getElementById(`recent-chat-dp-${contact.id}`);
            imageContainer.style.cssText = `
                background: url(${contact.avatar}) center no-repeat;
                background-size: cover;
            `;
        })
    }

    //Convert Date Object to readable time
    getMessageTime(date) {
        const currentTiming = new Date(Date.now());
        const latestMessageTime = new Date(date);
        if(currentTiming.getDate() === latestMessageTime.getDate()) {
            if(currentTiming.getMinutes() === latestMessageTime.getMinutes() && currentTiming.getHours() === latestMessageTime.getHours()) {
                return `just now`;
            }
            let hours = latestMessageTime.getHours();
            let minutes = latestMessageTime.getMinutes();
            return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
        } else {
            return `${latestMessageTime.getDate()}/${latestMessageTime.getMonth()+1}/${latestMessageTime.getFullYear().toString().substr(-2)}`
        }
    }

}
export const registerRecentChats = () => window.customElements.define('recent-chats', RecentChats);