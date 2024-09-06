import {audio} from "@/utils/index";

function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        return Notification.requestPermission();
    } else {
        return Promise.resolve(Notification.permission);
    }
}

export default function showNotificationWithSound(title, options) {

    audio.play().catch(e => console.error('Sound playback failed:', e));
    requestNotificationPermission().then(permission => {
        if (permission === 'granted') {
            new Notification(title, options);
        } else {
            console.log('Notification permission not granted.');
        }
    });

}
