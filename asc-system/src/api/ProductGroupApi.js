import axios from 'axios';

const getProductGroup = (token, callback) => {
	return axios
		.get(`http://localhost:4000/api/productgroups`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createProductGroup = (token, usn, pg, callback) => {
	axios
		.post(`http://localhost:4000/api/productgroups`, { usn, pg }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateProductGroup = (token, usn, pg, callback) => {
	axios
		.put(`http://localhost:4000/api/productgroups`, { usn, pg }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getProductGroup, createProductGroup, updateProductGroup };
