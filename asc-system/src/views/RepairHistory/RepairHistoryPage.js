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
	Typography,
	InputAdornment,
	IconButton
} from '@material-ui/core';
import { AddCircleOutline as AddIcon, Search } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header, ProductSearchDialog, AssetSearchDialog } from '../../components';
import { RepairHistorySearchForm } from '../../sections';
import { getProductGroup, searchProduct, searchAsset, createRepairHistory, searchRepairHistory } from '../../api';

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

const tableHead = ['Asset Code', 'Product Group', 'Product Name', 'Repair Date', 'Return Date', 'IT Supporter'];

class RepairHistoryPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
				astCd: '',
				pgCd: '',
				pdCd: '',
				repairDate: '',
				returnDate: '',
				username: '',
				itSupporter: '',
				detail: '',
				pgList: []
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
				itSupporter: '',
				repairDate: '',
				returnDate: '',
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
			this.setState({
				...this.state,
				search: { ...this.state.search, pgList },
				product: { ...this.state.product, pgList },
				asset: { ...this.state.asset, pgList }
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
		const { astCd, pgCd, pdCd, repairDate, returnDate, username, itSupporter, detail } = this.state.search;
		if (
			astCd !== '' ||
			pgCd !== '' ||
			pdCd !== '' ||
			repairDate !== '' ||
			returnDate !== '' ||
			username !== '' ||
			itSupporter !== '' ||
			detail !== ''
		) {
			(async () => {
				let rsList = await searchRepairHistory(
					this.props.auth.token,
					{
						astCd,
						pgCd,
						pdCd,
						repairDate,
						returnDate,
						username,
						itSupporter,
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
					rsList
				});
			})();
		} else alert('Please Fill Some Search Key');
	};

	handleOnCreate = () => {
		const { astCd, itSupporter, repairDate, returnDate, detail } = this.state.dialog;
		if (astCd === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: true,
					astCdHelperText: 'Please enter asset code'
				}
			});
		else if (itSupporter === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					itSupporterError: true,
					itSupporterHelperText: 'Please enter IT Supporter'
				}
			});
		else if (repairDate === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					itSupporterError: false,
					itSupporterHelperText: '',
					startDateError: true,
					startDateHelperText: 'Please enter repair date'
				}
			});
		else {
			createRepairHistory(
				this.props.auth.token,
				this.props.auth.usn,
				{
					astCd,
					itSupporter,
					repairDate,
					returnDate: returnDate === '' ? null : returnDate,
					detail
				},
				(err, success) => {
					if (success) {
						alert('Assign Repair Success!');
						this.handleOnToggle('dialog', 'open')();
					} else if (err === 'TimeOut') this.props.signout();
					else if (err === 'Exist') alert('Repairing already exists');
					else if (err === 'NoUsername') alert('IT supporter name incorrect');
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
		if (this.state.dialog.open) {
			this.setState({
				...this.state,
				asset: { ...this.state.asset, open: !this.state.asset.open },
				dialog: { ...this.state.dialog, astCd }
			});
		} else {
			this.setState({
				...this.state,
				asset: { ...this.state.asset, open: !this.state.asset.open },
				search: { ...this.state.search, astCd }
			});
		}
	};

	render() {
		const { classes } = this.props;
		const { search, dialog, product, asset } = this.state;

		const headerButtons = (
			<Button onClick={this.handleOnToggle('dialog', 'open')} className={classes.rightButton}>
				<AddIcon className={classes.icon} />
				new repair
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Repair History" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<RepairHistorySearchForm
								search={search}
								handleOnChange={this.handleOnChange}
								handleOnToggle={this.handleOnToggle}
								handleSearching={this.handleSearching}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<div style={{ padding: '2%' }}>
								<Typography variant="title">Repair History : {this.state.rsList.length}</Typography>
							</div>
							<Table>
								<TableHead>
									<TableRow>
										{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.rsList.map((rh, idx) => (
										<TableRow
											key={idx}
											hover
											component={NavLink}
											to={`/repairhistory/${rh.astCd}&&${rh.repairDate}`}
											style={{
												textDecoration: 'none'
											}}
										>
											<TableCell>{rh.astCd}</TableCell>
											<TableCell>{rh.pgName}</TableCell>
											<TableCell>{rh.pdName}</TableCell>
											<TableCell>{rh.repairDate}</TableCell>
											<TableCell>{rh.returnDate}</TableCell>
											<TableCell>{rh.itSupporter}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>

				<Dialog open={dialog.open} onClose={this.handleOnToggle('dialog', 'open')}>
					<DialogTitle>New Repair History</DialogTitle>
					<DialogContent>
						<Grid container spacing={16}>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Asset Code"
									error={dialog.astCdError}
									helperText={dialog.astCdHelperText}
									value={dialog.astCd}
									onChange={this.handleOnChange('dialog', 'astCd')}
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
									label="IT Supporter"
									error={dialog.itSupporterError}
									helperText={dialog.itSupporterHelperText}
									value={dialog.itSupporter}
									onChange={this.handleOnChange('dialog', 'itSupporter')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Repair Date"
									error={dialog.repairDateError}
									helperText={dialog.repairDateHelperText}
									type="date"
									value={dialog.repairDate}
									onChange={this.handleOnChange('dialog', 'repairDate')}
									InputLabelProps={{
										shrink: true
									}}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Return Date"
									type="date"
									value={dialog.returnDate}
									onChange={this.handleOnChange('dialog', 'returnDate')}
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

RepairHistoryPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(RepairHistoryPage);
