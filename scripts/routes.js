export const ROUTES = {
    home: {
        path: "/",
        template: `<home-screen></home-screen>`,
    },
    chat: (id) => {
        return {
            path: `/chat?id=${id}`,
            template: `<chat-screen userId=${id}></chat-screen>`,
        }
    }  
}