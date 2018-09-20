import axios from 'axios';
import { ip } from 'ip';

const getDivision = (token, callback) => {
	return axios
		.get(`${ip}/api/divisions`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createDivision = (token, usn, div, callback) => {
	axios.post(`${ip}/api/divisions`, { usn, div }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateDivision = (token, usn, div, callback) => {
	axios.put(`${ip}/api/divisions`, { usn, div }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getDivision, createDivision, updateDivision };
