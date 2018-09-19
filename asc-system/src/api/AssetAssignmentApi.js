import axios from 'axios';

const getAssetAssignment = (token, astCd, startDate, callback) => {
	return axios
		.get(`http://localhost:4000/api/asset_assignment/${astCd}&${startDate}`, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list[0]));
};

const searchAssetAssignment = (token, asm, callback) => {
	return axios
		.post(`http://localhost:4000/api/asset_assignment/search`, { asm }, { headers: { 'x-access-token': token } })
		.then(res => callback(res.data.error, res.data.list));
};

const createAssetAssignment = (token, usn, asm, callback) => {
	axios
		.post(`http://localhost:4000/api/asset_assignment`, { usn, asm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

const updateAssetAssignment = (token, usn, asm, callback) => {
	axios
		.put(`http://localhost:4000/api/asset_assignment`, { usn, asm }, { headers: { 'x-access-token': token } })
		.then(res => {
			callback(res.data.error, res.data.success);
		});
};

export { getAssetAssignment, searchAssetAssignment, createAssetAssignment, updateAssetAssignment };
