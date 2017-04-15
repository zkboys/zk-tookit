import * as request from '../request';

export function updateUserMessage(userMessage) {
    return request.put('/system/message', userMessage)
        .then(data => data);
}

export function updateUserPass(userPass) {
    return request.put('/system/pass', userPass)
        .then(data => data);
}
