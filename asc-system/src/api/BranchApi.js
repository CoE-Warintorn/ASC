import axios from 'axios';
import { ip } from 'ip';

const getBranch = (token, callback) => {
	return axios
		.get(`${ip}/api/branches`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createBranch = (token, usn, branch, callback) => {
	axios
		.post(`${ip}/api/branches`, { usn, branch }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateBranch = (token, usn, branch, callback) => {
	axios.put(`${ip}/api/branches`, { usn, branch }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getBranch, createBranch, updateBranch };
