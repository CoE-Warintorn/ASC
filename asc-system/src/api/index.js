import axios from 'axios';
import ip from './ip';

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
	axios.post(`${ip}/api/authenticate`, { username, password }).then(res => {
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

