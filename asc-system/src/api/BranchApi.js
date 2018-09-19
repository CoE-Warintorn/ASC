import axios from 'axios';

const getBranch = (token, callback) => {
	return axios
		.get(`http://localhost:4000/api/branches`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createBranch = (token, usn, branch, callback) => {
	axios
		.post(`http://localhost:4000/api/branches`, { usn, branch }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateBranch = (token, usn, branch, callback) => {
	axios.put(`http://localhost:4000/api/branches`, { usn, branch }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getBranch, createBranch, updateBranch };
