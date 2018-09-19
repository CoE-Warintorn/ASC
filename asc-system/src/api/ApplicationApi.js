import axios from 'axios';

const getApplication = (token, callback) => {
	return axios
		.get(`http://localhost:4000/api/applications`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createApplication = (token, usn, app, callback) => {
	axios
		.post(`http://localhost:4000/api/applications`, { usn, app }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateApplication = (token, usn, app, callback) => {
	axios
		.put(`http://localhost:4000/api/applications`, { usn, app }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getApplication, createApplication, updateApplication };
