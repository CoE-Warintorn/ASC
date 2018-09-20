import axios from 'axios';
import ip from './ip';

const getProductGroup = (token, callback) => {
	return axios
		.get(`${ip}/api/productgroups`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createProductGroup = (token, usn, pg, callback) => {
	axios
		.post(`${ip}/api/productgroups`, { usn, pg }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateProductGroup = (token, usn, pg, callback) => {
	axios
		.put(`${ip}/api/productgroups`, { usn, pg }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getProductGroup, createProductGroup, updateProductGroup };
