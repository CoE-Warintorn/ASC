import axios from 'axios';

const getDivision = (token, callback) => {
	return axios
		.get(`http://localhost:4000/api/divisions`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createDivision = (token, usn, div, callback) => {
	axios.post(`http://localhost:4000/api/divisions`, { usn, div }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

const updateDivision = (token, usn, div, callback) => {
	axios.put(`http://localhost:4000/api/divisions`, { usn, div }, { headers: { 'x-access-token': token } }).then(res => {
		callback(res.data.error, res.data.success);
	});
};

export { getDivision, createDivision, updateDivision };
