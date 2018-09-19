import axios from 'axios';

const searchPermission = (token, pms, callback) => {
	return axios
		.post(`http://localhost:4000/api/permission/search`, { pms }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const addPermission = (token, usn, pms, callback) => {
	axios.post(`http://localhost:4000/api/permission`, { usn, pms }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const deletePermission = (token, usn, pms, callback) => {
	axios
		.delete(`http://localhost:4000/api/permission`, { headers: { 'x-access-token': token }, data: { usn, pms } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { searchPermission, addPermission, deletePermission };
