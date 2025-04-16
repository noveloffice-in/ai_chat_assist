import alertSound from "../assets/audio/alertSound.mp3"

// Function to show a notification
const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, { body });

        // Play notification sound
        const audio = new Audio(alertSound);
        audio.play().catch(e => console.error("Failed to play sound:", e));
    }
};

export default showNotification;