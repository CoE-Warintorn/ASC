import axios from 'axios';
import ip from './ip';

const getApplication = (token, callback) => {
	return axios
		.get(`${ip}/api/applications`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createApplication = (token, usn, app, callback) => {
	axios
		.post(`${ip}/api/applications`, { usn, app }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateApplication = (token, usn, app, callback) => {
	axios
		.put(`${ip}/api/applications`, { usn, app }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getApplication, createApplication, updateApplication };
