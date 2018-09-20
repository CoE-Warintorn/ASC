import axios from 'axios';
import { ip } from 'ip';

const getDepartment = (token, callback) => {
	return axios
		.get(`${ip}/api/departments`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createDepartment = (token, usn, dpm, callback) => {
	axios
		.post(`${ip}/api/departments`, { usn, dpm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateDepartment = (token, usn, dpm, callback) => {
	axios.put(`${ip}/api/departments`, { usn, dpm }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getDepartment, createDepartment, updateDepartment };
