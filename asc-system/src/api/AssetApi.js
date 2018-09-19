import axios from 'axios';

const getAsset = (token, astCd, callback) => {
	return axios
		.get(`http://localhost:4000/api/assets/${astCd}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchAsset = (token, ast, callback) => {
	return axios
		.post(`http://localhost:4000/api/assets/search`, { ast }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createAsset = (token, usn, ast, callback) => {
	axios.post(`http://localhost:4000/api/assets`, { usn, ast }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateAsset = (token, usn, ast, callback) => {
	axios.put(`http://localhost:4000/api/assets`, { usn, ast }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getAsset, searchAsset, createAsset, updateAsset };
