import * as request from '../request';

export function getAllRoles() {
    return request.get('/organization/roles')
        .then(data => data);
}

export function getRolesByParams(params) {
    return request.get('/organization/roles', params)
        .then(data => data);
}
export function deleteRole(params) {
    return request.del('/organization/roles', params)
        .then(data => data);
}
export function addRole(params) {
    return request.post('/organization/roles', params)
        .then(data => data);
}

export function updateRole(params) {
    return request.put('/organization/roles', params)
        .then(data => data);
}
