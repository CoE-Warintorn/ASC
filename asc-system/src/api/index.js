import axios from 'axios';
import { getProductGroup, createProductGroup, updateProductGroup } from './ProductGroupApi';
import { getApplication, createApplication, updateApplication } from './ApplicationApi';
import { getBranch, createBranch, updateBranch } from './BranchApi';
import { getDivision, createDivision, updateDivision } from './DivisionApi';
import { getDepartment, createDepartment, updateDepartment } from './DepartmentApi';

import { getProduct, searchProduct, createProduct, updateProduct } from './ProductApi';
import { getAsset, searchAsset, createAsset, updateAsset } from './AssetApi';
import { getUser, searchUser, createUser, updateUser } from './UserApi';

import { getAssetAssignment, searchAssetAssignment, createAssetAssignment, updateAssetAssignment } from './AssetAssignmentApi';
import { getRepairHistory, searchRepairHistory, createRepairHistory, updateRepairHistory } from './RepairHistoryApi';
import { searchPermission, addPermission, deletePermission } from './PermissionApi';

const authenticate = (username, password, callback) => {
	axios.post('http://localhost:4000/api/authenticate', { username, password }).then(res => {
		if (res.data.success) callback(false, res.data.token);
		else callback(res.data.error, false);
	});
};

export {
	authenticate,
	getProductGroup,
	createProductGroup,
	updateProductGroup,
	getApplication,
	createApplication,
	updateApplication,
	getBranch,
	createBranch,
	updateBranch,
	getDivision,
	createDivision,
	updateDivision,
	getDepartment,
	createDepartment,
	updateDepartment,
	getProduct,
	searchProduct,
	createProduct,
	updateProduct,
	getAsset,
	searchAsset,
	createAsset,
	updateAsset,
	getUser,
	searchUser,
	createUser,
	updateUser,
	getAssetAssignment,
	searchAssetAssignment,
	createAssetAssignment,
	updateAssetAssignment,
	getRepairHistory,
	searchRepairHistory,
	createRepairHistory,
	updateRepairHistory,
	searchPermission,
	addPermission,
	deletePermission
};

// var products = [
// 	{
// 		pdCd: '100',
// 		pdName: 'DELL-PC'
// 	},
// 	{
// 		pdCd: '101',
// 		pdName: 'DELL-NB'
// 	},
// 	{
// 		pdCd: '102',
// 		pdName: 'LG-NB'
// 	},
// 	{
// 		pdCd: '103',
// 		pdName: 'LG-TV'
// 	},
// 	{
// 		pdCd: '104',
// 		pdName: 'SS-NB'
// 	},
// 	{
// 		pdCd: '105',
// 		pdName: 'SS-PC'
// 	}
// ];

// var productGroups = [
// 	{
// 		pgCd: 'PC',
// 		pgName: 'Computer Desktop'
// 	},
// 	{
// 		pgCd: 'NB',
// 		pgName: 'Computer Laptop'
// 	}
// ];

// const api = {
// 	getProductNames: () => products,
// 	getMinisProduct: () => {},
// 	getProduct: pdCd => {
// 		return {
// 			pdCd: pdCd,
// 			pdName: 'Test',
// 			pgCd: '',
// 			pgName: '',
// 			tradingType: '0',
// 			tradingProvider: '',
// 			warrantyFrom: '',
// 			warrantyTo: '',
// 			specification: 'Test',
// 			detail: 'Test'
// 		};
// 	},
// 	createProduct: pd => {},
// 	updateProduct: pd => {},
// 	getAssetNames: () => {},
// 	getMinisAsset: () => {},
// 	getAsset: astCd => {
// 		return {
// 			astCd: astCd,
// 			pdCd: '',
// 			serialNumber: '',
// 			detail: 'Test',
// 			writeOffDate: '',
// 			reason: ''
// 		};
// 	},
// 	createAsset: ast => {},
// 	updateAsset: ast => {},
// 	getUserNames: () => {},
// 	getMinisUser: () => {},
// 	getUser: usr => {
// 		return {
// 			username: usr,
// 			empCode: '',
// 			firstName: '',
// 			lastName: '',
// 			branchCd: '',
// 			divCd: '',
// 			dpmCd: '',
// 			intercom: '',
// 			phone: '',
// 			email: '',
// 			active: 1
// 		};
// 	},
// 	createUser: ast => {},
// 	updateUser: ast => {},
// 	getProductGroupNames: () => productGroups,
// 	createProductGroup: (pgCd, pgName) => {
// 		productGroups.push({ pgCd, pgName });
// 	},
// 	getAssignment: (astCd, startDate, edit = false) => {
// 		if (edit) {
// 			return {
// 				astCd: astCd,
// 				username: 'warintorn',
// 				branchCd: 'HDY',
// 				divCd: 'IT',
// 				dpmCd: 'IS',
// 				location: 'Infra structure room',
// 				startDate: startDate,
// 				endDate: '2099-12-31',
// 				detail: 'Test'
// 			};
// 		}
// 		return {
// 			astCd: astCd,
// 			username: 'warintorn',
// 			branchName: 'HDY',
// 			divName: 'IT',
// 			dpmName: 'Infra Structure',
// 			location: 'Infra Structure Room',
// 			startDate: startDate,
// 			endDate: '2099-12-31',
// 			detail: 'Test'
// 		};
// 	},
// 	getRepairHistory: (astCd, repairDate) => {
// 		return {
// 			astCd: astCd,
// 			itSupporter: 'warintorn',
// 			repairDate: repairDate,
// 			returnDate: '2099-12-31',
// 			detail: 'Test'
// 		};
// 	},
// 	getBranchNames: () => [],
// 	getDivisionNames: () => [{ divCd: 'IT', divName: 'IT' }],
// 	getDepartmentNames: () => []
// };

// export default api;
