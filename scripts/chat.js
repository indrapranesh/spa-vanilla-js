import ChatService from "../services/chatService.js";
import Router from './router.js';

export class Chat extends HTMLElement {

    constructor() {
        super();
        this.chatService = new ChatService();
        this.router = new Router();
    }

    static get observedAttributes() {
        return [`userId`];
      }

    async connectedCallback() {
        const id = this.getAttribute('userId');
        const userChat = await this.chatService.getMessagesByUserId(id);
        const host = document.createElement('div');
        host.className = 'chat-screen';
        this.appendChild(host);

        let chatScreenHtml = `
            <div class="action-icons-wrapper d-flex align-start pb-3">
                <img class="action-icon cursor-pointer" id="back-icon-chat" src="./assets/icons/back-arrow.svg" />
                <div class="d-flex flex-column pl-3">
                    <div class="contact-name">${userChat.name}</div>
                    <div class="d-flex align-center grey-text contact-active pt-1">${userChat.online ? `Active now <div class="online-indicator ml-2"></div>` : `last seen recently`}</div>
                </div>
            </div>`;
        
        // Sort messages by time
        let messages =  userChat.messages.sort((a,b) => {
            return new Date(b.time) < new Date(a.time) ? 1 : -1
        });
        let messagesHtml = messages.map((message, index) => {
            const hours = new Date(message.time).getHours(); 
            const minutes = new Date(message.time).getMinutes();
            return !message.sent ? `
                <div class="d-flex align-end justify-start pt-2">
                    ${
                        messages[index+1]?.sent || !messages[index+1] ? `<div class="contact-dp mb-2"></div>` : '<div class="contact-dp-spacing"></div>'
                    }
                    <div class="message-text message-left ml-2">${message.message}</div> 
                </div>
                ${
                    messages[index + 1]?.sent || !messages[index+1] ? `
                    <div class="message-time grey-text pt-2 message-time-left d-flex justify-start">
                        ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}
                    </div>` : ''
                }
            ` : `
                <div class="d-flex align-end justify-end pt-2">
                    <div class="message-text message-right">${message.message}</div> 
                </div>
                ${
                    messages[index+1]?.sent ? '' : `
                        <div class="message-time grey-text message-time-right pt-2 d-flex justify-end">
                        ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}
                        </div>
                    `
                }
            `
        })
        .join('');
        let messageContainer = `
            <div class="message-container pb-3">${messagesHtml}</div>
        `;

        // Auto Expandable chat text box
        let textBoxHtml  = `
            <div class="text-box-container mt-3">
                <div contenteditable="true" placeholder="Type new message" class="chat-text-box"></div>
                <div class="send-message d-flex align-center justify-center">
                    <img class="send-icon" src="assets/icons/send-msg.svg" />
                </div>
            </div>
        `
        chatScreenHtml += (messageContainer + textBoxHtml);
        host.insertAdjacentHTML('afterbegin', chatScreenHtml);
        document.querySelectorAll(`.contact-dp`).forEach((element) => {
            element.setAttribute('style', `
            background: url(${userChat.avatar}) center no-repeat;
            background-size: cover;
        `) ;
        })
        const messageWrapper = document.querySelector('.message-container');
        messageWrapper.scrollTop = messageWrapper.scrollHeight;
        this.handleEvents();
    }

    handleEvents = () => {
        document.getElementById('back-icon-chat').onclick = () => {
            this.router.load('home');
        }
    }
}
export const registerChatScreen = () => window.customElements.define('chat-screen', Chat);