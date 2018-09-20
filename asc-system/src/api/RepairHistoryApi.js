import axios from 'axios';
import { ip } from 'ip';

const getRepairHistory = (token, astCd, repairDate, callback) => {
	return axios
		.get(`${ip}/api/repair_history/${astCd}&${repairDate}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchRepairHistory = (token, rh, callback) => {
	return axios
		.post(`${ip}/api/repair_history/search`, { rh }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createRepairHistory = (token, usn, rh, callback) => {
	axios
		.post(`${ip}/api/repair_history`, { usn, rh }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateRepairHistory = (token, usn, rh, callback) => {
	axios
		.put(`${ip}/api/repair_history`, { usn, rh }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getRepairHistory, searchRepairHistory, createRepairHistory, updateRepairHistory };
