import axios from 'axios';
import { ip } from 'ip';

const getAsset = (token, astCd, callback) => {
	return axios
		.get(`${ip}/api/assets/${astCd}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchAsset = (token, ast, callback) => {
	return axios
		.post(`${ip}/api/assets/search`, { ast }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createAsset = (token, usn, ast, callback) => {
	axios.post(`${ip}/api/assets`, { usn, ast }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateAsset = (token, usn, ast, callback) => {
	axios.put(`${ip}/api/assets`, { usn, ast }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getAsset, searchAsset, createAsset, updateAsset };
