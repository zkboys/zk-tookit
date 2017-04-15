import * as request from '../request';

export function getAll() {
    return request.get('/organization/organizations')
        .then(data => data);
}

export function save(params) {
    return request.post('/organization/organizations', params)
        .then(data => data);
}
