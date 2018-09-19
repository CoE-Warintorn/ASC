import axios from 'axios';

const getProduct = (token, pdCd, callback) => {
	return axios
		.get(`http://localhost:4000/api/products/${pdCd}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchProduct = (token, pd, callback) => {
	return axios
		.post(`http://localhost:4000/api/products/search`, { pd }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createProduct = (token, usn, pd, callback) => {
	axios.post(`http://localhost:4000/api/products`, { usn, pd }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateProduct = (token, usn, pd, callback) => {
	axios.put(`http://localhost:4000/api/products`, { usn, pd }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getProduct, searchProduct, createProduct, updateProduct };
