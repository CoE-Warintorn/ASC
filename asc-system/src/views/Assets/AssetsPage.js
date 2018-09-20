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

import { Header, ProductSearchDialog } from '../../components';
import { AssetSearchForm } from '../../sections';
import { getProductGroup, searchAsset, createAsset, searchProduct } from '../../api';

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

const tableHead = ['Asset Code', 'Product Group', 'Product Name', 'Serial Number', 'Detail', 'Status'];

class AssetsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
				astCd: '',
				pgList: [],
				pgCd: '',
				pdCd: '',
				serialNumber: '',
				statusList: [
					{ key: 'all', name: 'All' },
					{ key: 'active', name: 'Active' },
					{ key: 'repairing', name: 'Repairing' },
					{ key: 'spare', name: 'Spare' },
					{ key: 'writeOff', name: 'Write-off' }
				],
				status: '',
				detail: ''
			},
			product: {
				open: false,
				pdCd: '',
				pdName: '',
				pgList: [],
				pgCd: '',
				tTypes: [{ key: 'all', name: 'All' }, { key: 'purchase', name: 'Purchase' }, { key: 'hire', name: 'Hire' }],
				tradingType: '',
				tradingProvider: '',
				inWarrantyTypes: [{ key: 'all', name: 'All' }, { key: 'yes', name: 'Yes' }, { key: 'no', name: 'No' }],
				inWarranty: '',
				spec: '',
				detail: '',
				pdList: []
			},
			dialog: {
				open: false,
				astCd: '',
				astCdError: false,
				astCdHelperText: '',
				pdCd: '',
				pdCdError: false,
				pdCdHelperText: '',
				serialNumber: '',
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
				product: { ...this.state.product, pgList }
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
		const { astCd, pgCd, pdCd, serialNumber, status, detail } = this.state.search;
		if (astCd !== '' || pgCd !== '' || pdCd !== '' || serialNumber !== '' || status !== '' || detail !== '') {
			(async () => {
				let rsList = await searchAsset(
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
					rsList
				});
			})();
		} else alert('Please Fill Some Search Key');
	};

	handleDialogToggle = () => {
		this.setState({
			...this.state,
			dialog: {
				open: !this.state.dialog.open,
				astCd: '',
				astCdError: false,
				astCdHelperText: '',
				pdCdError: false,
				pdCdHelperText: '',
				pdCd: '',
				serialNumber: '',
				detail: ''
			}
		});
	};

	handleOnCreate = () => {
		const { astCd, pdCd, serialNumber, detail } = this.state.dialog;
		if (astCd === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: true,
					astCdHelperText: 'Please enter asset code'
				}
			});
		else if (pdCd === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					astCdError: false,
					astCdHelperText: '',
					pdCdError: true,
					pdCdHelperText: 'Please enter product code'
				}
			});
		else {
			createAsset(
				this.props.auth.token,
				this.props.auth.usn,
				{
					astCd,
					pdCd,
					serialNumber,
					detail
				},
				(err, success) => {
					if (success) {
						alert('Add Asset Success!');
						this.handleDialogToggle();
					} else if (err === 'TimeOut') this.props.signout();
					else if (err === 'Exist') alert('Asset code already exists');
					else alert(JSON.stringify(err));
				}
			);
		}
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
		if (this.state.dialog.open) {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
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

	render() {
		const { classes } = this.props;
		const { dialog, product } = this.state;

		const headerButtons = (
			<Button onClick={this.handleDialogToggle} className={classes.rightButton}>
				<AddIcon className={classes.icon} />
				new asset
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Assets" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<AssetSearchForm
								search={this.state.search}
								handleOnChange={this.handleOnChange}
								handleSearching={this.handleSearching}
								handleOnToggle={this.handleOnToggle}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<div style={{ padding: '2%' }}>
								<Typography variant="title">Asset : {this.state.rsList.length}</Typography>
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
											to={`/assets/${ast.astCd}`}
											style={{ textDecoration: 'none' }}
										>
											<TableCell>{ast.astCd}</TableCell>
											<TableCell>{ast.pgName}</TableCell>
											<TableCell>{ast.pdName}</TableCell>
											<TableCell>{ast.serialNumber}</TableCell>
											<TableCell>{ast.detail}</TableCell>
											<TableCell>{ast.writeOffDate}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>

				<Dialog open={dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Asset</DialogTitle>
					<DialogContent>
						<Grid container spacing={16}>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Asset Code"
									value={dialog.astCd}
									onChange={this.handleOnChange('dialog', 'astCd')}
									error={dialog.astCdError}
									helperText={dialog.astCdHelperText}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Product Code"
									value={dialog.pdCd}
									onChange={this.handleOnChange('dialog', 'pdCd')}
									error={dialog.pdCdError}
									helperText={dialog.pdCdHelperText}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton>
													<Search onClick={this.handleOnToggle('product', 'open')} />
												</IconButton>
											</InputAdornment>
										)
									}}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Serial Number"
									value={dialog.serialNumber}
									onChange={this.handleOnChange('dialog', 'serialNumber')}
									error={dialog.serialNumberError}
									helperText={dialog.serialNumberHelperText}
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
						<Button onClick={this.handleDialogToggle} color="primary">
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
					handleOnSelect={this.handleOnSelect}
					handleProductDialogOnSelect={this.handleProductDialogOnSelect}
					handleProductDialogOnSearch={this.handleProductDialogOnSearch}
					handleOnToggle={this.handleOnToggle}
				/>
			</div>
		);
	}
}

AssetsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssetsPage);
