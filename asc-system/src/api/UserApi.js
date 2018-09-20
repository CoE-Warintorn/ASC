import axios from 'axios';
import { ip } from 'ip';

const getUser = (token, username, callback) => {
	return axios
		.get(`${ip}/api/users/${username}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchUser = (token, user, callback) => {
	return axios
		.post(`${ip}/api/users/search`, { user }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createUser = (token, usn, user, callback) => {
	axios.post(`${ip}/api/users`, { usn, user }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateUser = (token, usn, user, callback) => {
	axios.put(`${ip}/api/users`, { usn, user }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getUser, searchUser, createUser, updateUser };
