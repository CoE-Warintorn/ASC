import axios from 'axios';
import ip from './ip';

const getProduct = (token, pdCd, callback) => {
	return axios
		.get(`${ip}/api/products/${pdCd}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchProduct = (token, pd, callback) => {
	return axios
		.post(`${ip}/api/products/search`, { pd }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createProduct = (token, usn, pd, callback) => {
	axios.post(`${ip}/api/products`, { usn, pd }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateProduct = (token, usn, pd, callback) => {
	axios.put(`${ip}/api/products`, { usn, pd }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getProduct, searchProduct, createProduct, updateProduct };
