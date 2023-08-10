/**
 * Service Layer for Chat API
 */

export default class ChatService {
    getFavourites = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch('services/mock-data/favourites.json');
                response = await response.json();
                resolve(response);
            } catch(err) {
                reject(err);
            }
        })
    }

    getRecentChats = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch('services/mock-data/recent-chats.json');
                response = await response.json();
                // Sort messages by time
                response.sort((a,b) => {
                    return new Date(a.lastMessage.time) < new Date(b.lastMessage.time) ? 1 : -1
                });
                resolve(response);
            } catch(err) {
                reject(err);
            }
        })
    }

    getMessagesByUserId = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(`services/mock-data/user-${id}.json`);
                response = await response.json();
                resolve(response);
            } catch(err) {
                reject(err);
            }
        })
    }

    searchMessages = (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(`services/mock-data/messages.json`);
                response = await response.json();
                response = response.filter((message) => {
                    if(message.message.toLowerCase().includes(key.toLowerCase().trim())) {
                        return message;
                    }
                });
                resolve(response);
            } catch(err) {
                reject(err);
            }
        })
    }

}