import {
	ProductGroupsPage,
	ProductsPage,
	ProductDetailShowPage,
	ProductDetailEditPage,
	AssetsPage,
	AssetDetailShowPage,
	AssetDetailEditPage,
	UsersPage,
	UserDetailShowPage,
	UserDetailEditPage,
	ApplicationsPage,
	BranchesPage,
	DivisionsPage,
	DepartmentsPage,
	AssignmentPage,
	AssignmentDetailShowPage,
	AssignmentDetailEditPage,
	PermissionPage,
	RepairHistoryPage,
	RepairHistoryDetailShowPage,
	RepairHistoryDetailEditPage
} from '../views';

const appRoutes = [
	{
		path: '/productgroups',
		name: 'Product Groups',
		component: ProductGroupsPage,
		menu: true
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsPage,
		menu: true
	},
	{
		path: '/products/:pdCd',
		name: 'ProductShowDetail',
		component: ProductDetailShowPage
	},
	{
		path: '/products/edit/:pdCd',
		name: 'ProductEditDetail',
		component: ProductDetailEditPage
	},
	{
		path: '/assets',
		name: 'Assets',
		component: AssetsPage,
		menu: true
	},
	{
		path: '/assets/:astCd',
		name: 'AssetShowDetail',
		component: AssetDetailShowPage
	},
	{
		path: '/assets/edit/:astCd',
		name: 'AssetEditDetail',
		component: AssetDetailEditPage
	},
	{
		path: '/users',
		name: 'Users',
		component: UsersPage,
		menu: true
	},
	{
		path: '/users/:username',
		name: 'UserShowDetail',
		component: UserDetailShowPage
	},
	{
		path: '/users/edit/:username',
		name: 'UserEditDetail',
		component: UserDetailEditPage
	},
	{
		path: '/applications',
		name: 'Applications',
		component: ApplicationsPage,
		menu: true
	},
	{
		path: '/branches',
		name: 'Branches',
		component: BranchesPage,
		menu: true
	},
	{
		path: '/divisions',
		name: 'Divisions',
		component: DivisionsPage,
		menu: true
	},
	{
		path: '/departments',
		name: 'Departments',
		component: DepartmentsPage,
		menu: true
	},
	{
		path: '/assignment',
		name: 'Asset Assignment',
		component: AssignmentPage,
		menu: true
	},
	{
		path: '/assignment/:astCd&&:startDate',
		name: 'AssignmentShowDetail',
		component: AssignmentDetailShowPage
	},
	{
		path: '/assignment/edit/:astCd&&:startDate',
		name: 'AssignmentEditDetail',
		component: AssignmentDetailEditPage
	},
	{
		path: '/permission',
		name: 'Permission',
		component: PermissionPage,
		menu: true
	},
	{
		path: '/repairhistory',
		name: 'Repair History',
		component: RepairHistoryPage,
		menu: true
	},
	{
		path: '/repairhistory/:astCd&&:repairDate',
		name: 'RepairHistoryShowDetail',
		component: RepairHistoryDetailShowPage
	},
	{
		path: '/repairhistory/edit/:astCd&&:repairDate',
		name: 'RepairHistoryEditDetail',
		component: RepairHistoryDetailEditPage
	}
];

export default appRoutes;
