import axios from 'axios';

const getRepairHistory = (token, astCd, repairDate, callback) => {
	return axios
		.get(`http://localhost:4000/api/repair_history/${astCd}&${repairDate}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchRepairHistory = (token, rh, callback) => {
	return axios
		.post(`http://localhost:4000/api/repair_history/search`, { rh }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createRepairHistory = (token, usn, rh, callback) => {
	axios
		.post(`http://localhost:4000/api/repair_history`, { usn, rh }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateRepairHistory = (token, usn, rh, callback) => {
	axios
		.put(`http://localhost:4000/api/repair_history`, { usn, rh }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getRepairHistory, searchRepairHistory, createRepairHistory, updateRepairHistory };
