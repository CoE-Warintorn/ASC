import axios from 'axios';
import ip from './ip';

const authenticate = (username, password, callback) => {
	axios.post(`${ip}/api/authenticate`, { username, password }).then(res => {
		if (res.data.success) callback(false, res.data.token);
		else callback(res.data.error, false);
	});
};

const getUsers = token => {
	return axios
		.get(`${ip}/api/admin/users`, { headers: { 'x-access-token': token } })
		.then(res => res.data.list);
};

const createUser = (token, usn, user, callback) => {
	axios
		.post(`${ip}/api/admin/users`, { usn, user }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateUser = (token, usn, user, callback) => {
	axios
		.put(`${ip}/api/admin/users`, { usn, user }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { authenticate, createUser, getUsers, updateUser };
