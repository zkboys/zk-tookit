import * as request from './request';

export function logout() {
    return request.post('/signout')
        .then(data => data);
}
