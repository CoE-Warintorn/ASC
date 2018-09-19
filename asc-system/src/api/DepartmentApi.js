import axios from 'axios';

const getDepartment = (token, callback) => {
	return axios
		.get(`http://localhost:4000/api/departments`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createDepartment = (token, usn, dpm, callback) => {
	axios
		.post(`http://localhost:4000/api/departments`, { usn, dpm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateDepartment = (token, usn, dpm, callback) => {
	axios.put(`http://localhost:4000/api/departments`, { usn, dpm }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getDepartment, createDepartment, updateDepartment };
