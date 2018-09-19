import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Button,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Grid,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	Typography,
	InputAdornment,
	IconButton,
	InputLabel,
	Select,
	MenuItem
} from '@material-ui/core';
import { AddCircleOutline as AddIcon, Search } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header, ProductSearchDialog, AssetSearchDialog } from '../../components';
import { AssignmentSearchForm } from '../../sections';
import {
	getProductGroup,
	getBranch,
	getDivision,
	getDepartment,
	searchProduct,
	searchAsset,
	searchAssetAssignment,
	createAssetAssignment
} from '../../api';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	root: {
		display: 'flex',
		flexGrow: 1
	},
	break: {
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	rightButton: {
		margin: theme.spacing.unit,
		color: 'inherit'
	},
	icon: {
		marginRight: theme.spacing.unit
	},
	content: {
		padding: theme.spacing.unit
	},
	griditem: {},
	table: {
		overflowX: 'auto'
	},
	input: {
		width: '80%'
	}
});

const tableHead = ['Asset Code', 'Serial Number', 'Username', 'Branch', 'Division', 'Department', 'Status'];

class AssignmentPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
				astCd: '',
				pgCd: '',
				pdCd: '',
				serialNumber: '',
				astDetail: '',
				username: '',
				branchCd: '',
				divCd: '',
				dpmCd: '',
				a_location: '',
				detail: '',
				status: '',
				showHistory: false,
				pgList: [],
				branchList: [],
				divList: [],
				dpmList: [],
				statusList: [
					{ key: 'all', name: 'All' },
					{ key: 'active', name: 'Active' },
					{
						key: 'repairing',
						name: 'Repairing'
					},
					{ key: 'spare', name: 'Spare' },
					{
						key: 'writeOff',
						name: 'Write-off'
					}
				]
			},
			product: {
				open: false,
				pdCd: '',
				pdName: '',
				pgList: [],
				pgCd: '',
				tTypes: [
					{ key: 'all', name: 'All' },
					{
						key: 'purchase',
						name: 'Purchase'
					},
					{ key: 'hire', name: 'Hire' }
				],
				tradingType: '',
				tradingProvider: '',
				inWarrantyTypes: [{ key: 'all', name: 'All' }, { key: 'yes', name: 'Yes' }, { key: 'no', name: 'No' }],
				inWarranty: '',
				spec: '',
				detail: '',
				pdList: []
			},
			asset: {
				open: false,
				astCd: '',
				pgList: [],
				pgCd: '',
				pdCd: '',
				serialNumber: '',
				statusList: [
					{ key: 'all', name: 'All' },
					{ key: 'active', name: 'Active' },
					{
						key: 'repairing',
						name: 'Repairing'
					},
					{ key: 'spare', name: 'Spare' },
					{
						key: 'writeOff',
						name: 'Write-off'
					}
				],
				status: '',
				detail: '',
				astList: []
			},
			dialog: {
				open: false,
				astCd: '',
				username: '',
				branchCd: '',
				divCd: '',
				dpmCd: '',
				a_location: '',
				startDate: '',
				endDate: '',
				detail: ''
			},
			rsList: []
		};
	}

	componentDidMount() {
		(async () => {
			let pgList = await getProductGroup(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			let branchList = await getBranch(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			let divList = await getDivision(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			let dpmList = await getDepartment(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				search: {
					...this.state.search,
					pgList,
					branchList,
					divList,
					dpmList
				},
				product: {
					...this.state.product,
					pgList
				},
				asset: {
					...this.state.asset,
					pgList
				}
			});
		})();
	}

	handleOnChange = (prop, name) => e => {
		const { value } = e.target;
		this.setState({
			...this.state,
			[prop]: {
				...this.state[prop],
				[name]: value
			}
		});
	};

	handleOnToggle = (prop, name) => () => {
		this.setState({
			...this.state,
			[prop]: {
				...this.state[prop],
				[name]: !this.state[prop][name]
			}
		});
	};

	handleOnSelect = (prop, name) => e => {
		this.setState({
			...this.state,
			[prop]: {
				...this.state[prop],
				[name]: {
					key: e.currentTarget.getAttribute('data-key'),
					value: e.currentTarget.getAttribute('data-value')
				}
			}
		});
	};

	handleSearching = () => {
		const {
			astCd,
			pgCd,
			pdCd,
			serialNumber,
			astDetail,
			username,
			branchCd,
			divCd,
			dpmCd,
			a_location,
			detail,
			status,
			showHistory
		} = this.state.search;
		if (
			astCd !== '' ||
			pgCd !== '' ||
			pdCd !== '' ||
			serialNumber !== '' ||
			astDetail !== '' ||
			username !== '' ||
			branchCd !== '' ||
			divCd !== '' ||
			dpmCd !== '' ||
			a_location !== '' ||
			detail !== '' ||
			status !== ''
		) {
			(async () => {
				let rsList = await searchAssetAssignment(
					this.props.auth.token,
					{
						astCd,
						pgCd,
						pdCd,
						serialNumber,
						astDetail,
						username,
						branchCd,
						divCd,
						dpmCd,
						a_location,
						detail,
						status,
						showHistory
					},
					(err, result) => {
						if (err)
							if (err === 'TimeOut') this.props.signout();
							else alert(JSON.stringify(err));
						else return result;
					}
				);
				this.setState({
					...this.state,
					rsList
				});
			})();
		} else alert('Please Fill Some Search Key');
	};

	handleOnCreate = () => {
		const { astCd, username, branchCd, divCd, dpmCd, a_location, startDate, endDate, detail } = this.state.dialog;
		if (astCd === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: true,
					astCdHelperText: 'Please enter asset code'
				}
			});
		else if (username === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					usernameError: true,
					usernameHelperText: 'Please enter username'
				}
			});
		else if (startDate === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					usernameError: false,
					usernameHelperText: '',
					startDateError: true,
					startDateHelperText: 'Please enter start date'
				}
			});
		else if (endDate === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					usernameError: false,
					usernameHelperText: '',
					startDateError: false,
					startDateHelperText: '',
					endDateError: true,
					endDateHelperText: 'Please enter end date'
				}
			});
		else {
			createAssetAssignment(
				this.props.auth.token,
				this.props.auth.usn,
				{
					astCd,
					username,
					branchCd,
					divCd,
					dpmCd,
					a_location,
					startDate,
					endDate,
					detail
				},
				(err, success) => {
					if (success) {
						alert('Assign Asset Success!');
						this.handleOnToggle('dialog', 'open')();
					} else if (err === 'TimeOut') this.props.signout();
					else if (err === 'Exist') alert('Assignment already exists');
					else if (err === 'NoUsername') alert('Username incorrect');
					else alert(JSON.stringify(err));
				}
			);
		}
	};

	handleProductDialogOnSearch = e => {
		e.preventDefault();
		const { pdCd, pdName, pgCd, tradingType, tradingProvider, inWarranty, spec, detail } = this.state.product;
		if (
			pdCd !== '' ||
			pdName !== '' ||
			pgCd !== '' ||
			tradingType !== '' ||
			tradingProvider !== '' ||
			inWarranty !== '' ||
			spec !== '' ||
			detail !== ''
		) {
			(async () => {
				let pdList = await searchProduct(
					this.props.auth.token,
					{
						pdCd,
						pdName,
						pgCd,
						tradingType,
						tradingProvider,
						inWarranty,
						spec,
						detail
					},
					(err, result) => {
						if (err)
							if (err === 'TimeOut') this.props.signout();
							else alert(JSON.stringify(err));
						else return result;
					}
				);
				this.setState({
					...this.state,
					product: {
						...this.state.product,
						pdList
					}
				});
			})();
		} else alert('Please Fill Some Search Key');
	};

	handleProductDialogOnSelect = pdCd => e => {
		e.preventDefault();
		if (this.state.asset.open) {
			this.setState({
				...this.state,
				asset: {
					...this.state.asset,
					pdCd
				},
				product: {
					...this.state.product,
					open: !this.state.product.open
				}
			});
		} else {
			this.setState({
				...this.state,
				search: {
					...this.state.search,
					pdCd
				},
				product: {
					...this.state.product,
					open: !this.state.product.open
				}
			});
		}
	};

	handleAssetDialogOnSearch = e => {
		e.preventDefault();
		const { astCd, pgCd, pdCd, serialNumber, status, detail } = this.state.asset;
		if (astCd !== '' || pgCd !== '' || pdCd !== '' || serialNumber !== '' || status !== '' || detail !== '') {
			(async () => {
				let astList = await searchAsset(
					this.props.auth.token,
					{
						astCd,
						pgCd,
						pdCd,
						serialNumber,
						status,
						detail
					},
					(err, result) => {
						if (err)
							if (err === 'TimeOut') this.props.signout();
							else alert(JSON.stringify(err));
						else return result;
					}
				);
				this.setState({
					...this.state,
					asset: {
						...this.state.asset,
						astList
					}
				});
			})();
		} else alert('Please Fill Some Search Key');
	};

	handleAssetDialogOnSelect = astCd => e => {
		e.preventDefault();
		this.setState({
			...this.state,
			asset: {
				...this.state.asset,
				open: !this.state.asset.open
			},
			dialog: { ...this.state.dialog, astCd }
		});
	};

	render() {
		const { classes } = this.props;
		const { search, dialog, product, asset } = this.state;

		const headerButtons = (
			<Button onClick={this.handleOnToggle('dialog', 'open')} className={classes.rightButton}>
				<AddIcon className={classes.icon} />
				assign
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Asset Assignment" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<AssignmentSearchForm
								search={this.state.search}
								handleOnChange={this.handleOnChange}
								handleOnToggle={this.handleOnToggle}
								handleSearching={this.handleSearching}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<div
								style={{
									padding: '2%'
								}}
							>
								<Typography variant="title">Asset Assignment : {this.state.rsList.length}</Typography>
							</div>
							<Table>
								<TableHead>
									<TableRow>
										{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.rsList.map(ast => (
										<TableRow
											key={ast.astCd}
											hover
											component={NavLink}
											to={`/assignment/${ast.astCd}&&${ast.startDate}`}
											style={{
												textDecoration: 'none'
											}}
										>
											<TableCell>{ast.astCd}</TableCell>
											<TableCell>{ast.serialNumber}</TableCell>
											<TableCell>{ast.username}</TableCell>
											<TableCell>{ast.branchName}</TableCell>
											<TableCell>{ast.divName}</TableCell>
											<TableCell>{ast.dpmName}</TableCell>
											<TableCell>{ast.status}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>

				<Dialog open={dialog.open} onClose={this.handleOnToggle('dialog', 'open')}>
					<DialogTitle>Assign</DialogTitle>
					<DialogContent>
						<Grid container spacing={16}>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Asset Code"
									error={dialog.astCdError}
									helperText={dialog.astCdHelperText}
									value={dialog.astCd}
									onChange={this.handleOnChange('dialog', 'astCd')}
									inputProps={{
										maxLength: 5
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton>
													<Search onClick={this.handleOnToggle('asset', 'open')} />
												</IconButton>
											</InputAdornment>
										)
									}}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Username"
									error={dialog.usernameError}
									helperText={dialog.usernameHelperText}
									value={dialog.username}
									onChange={this.handleOnChange('dialog', 'username')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl className={classes.input}>
									<InputLabel>Branch</InputLabel>
									<Select value={dialog.branchCd} onChange={this.handleOnChange('dialog', 'branchCd')}>
										{search.branchList.map((br, idx) => (
											<MenuItem key={idx} value={br.branchCd}>
												{`${br.branchCd} - ${br.branchName}`}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl className={classes.input}>
									<InputLabel>Division</InputLabel>
									<Select value={dialog.divCd} onChange={this.handleOnChange('dialog', 'divCd')}>
										{search.divList.map((br, idx) => (
											<MenuItem key={idx} value={br.divCd}>
												{`${br.divCd} - ${br.divName}`}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl className={classes.input}>
									<InputLabel>Department</InputLabel>
									<Select value={dialog.dpmCd} onChange={this.handleOnChange('dialog', 'dpmCd')}>
										{search.dpmList.map((br, idx) => (
											<MenuItem key={idx} value={br.dpmCd}>
												{`${br.dpmCd} - ${br.dpmName}`}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Location"
									value={dialog.a_location}
									onChange={this.handleOnChange('dialog', 'a_location')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Start Date"
									error={dialog.startDateError}
									helperText={dialog.startDateHelperText}
									type="date"
									value={dialog.startDate}
									onChange={this.handleOnChange('dialog', 'startDate')}
									InputLabelProps={{
										shrink: true
									}}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="End Date"
									error={dialog.endDateError}
									helperText={dialog.endDateHelperText}
									type="date"
									value={dialog.endDate}
									onChange={this.handleOnChange('dialog', 'endDate')}
									InputLabelProps={{
										shrink: true
									}}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Detail"
									multiline
									rows="10"
									value={dialog.detail}
									onChange={this.handleOnChange('dialog', 'detail')}
									fullWidth
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleOnToggle('dialog', 'open')} color="primary">
							cancel
						</Button>
						<Button onClick={this.handleOnCreate} color="primary">
							create
						</Button>
					</DialogActions>
				</Dialog>
				<ProductSearchDialog
					product={product}
					handleOnChange={this.handleOnChange}
					handleOnToggle={this.handleOnToggle}
					handleProductDialogOnSelect={this.handleProductDialogOnSelect}
					handleProductDialogOnSearch={this.handleProductDialogOnSearch}
				/>
				<AssetSearchDialog
					asset={asset}
					handleOnChange={this.handleOnChange}
					handleOnToggle={this.handleOnToggle}
					handleAssetDialogOnSelect={this.handleAssetDialogOnSelect}
					handleAssetDialogOnSearch={this.handleAssetDialogOnSearch}
				/>
			</div>
		);
	}
}

AssignmentPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssignmentPage);
