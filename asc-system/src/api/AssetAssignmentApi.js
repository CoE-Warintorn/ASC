import axios from 'axios';
import { ip } from 'ip';

const getAssetAssignment = (token, astCd, startDate, callback) => {
	return axios
		.get(`${ip}/api/asset_assignment/${astCd}&${startDate}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchAssetAssignment = (token, asm, callback) => {
	return axios
		.post(`${ip}/api/asset_assignment/search`, { asm }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createAssetAssignment = (token, usn, asm, callback) => {
	axios
		.post(`${ip}/api/asset_assignment`, { usn, asm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateAssetAssignment = (token, usn, asm, callback) => {
	axios
		.put(`${ip}/api/asset_assignment`, { usn, asm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getAssetAssignment, searchAssetAssignment, createAssetAssignment, updateAssetAssignment };
