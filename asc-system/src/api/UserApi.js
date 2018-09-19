import axios from 'axios';

const getUser = (token, username, callback) => {
	return axios
		.get(`http://localhost:4000/api/users/${username}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchUser = (token, user, callback) => {
	return axios
		.post(`http://localhost:4000/api/users/search`, { user }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createUser = (token, usn, user, callback) => {
	axios.post(`http://localhost:4000/api/users`, { usn, user }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateUser = (token, usn, user, callback) => {
	axios.put(`http://localhost:4000/api/users`, { usn, user }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getUser, searchUser, createUser, updateUser };
