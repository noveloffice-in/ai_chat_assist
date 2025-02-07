// Function to show a notification
const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
};

export default  showNotification;