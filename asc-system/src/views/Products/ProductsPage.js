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
	FormHelperText,
	InputLabel,
	FormLabel,
	Select,
	MenuItem,
	RadioGroup,
	Radio,
	FormControlLabel,
	Typography
} from '@material-ui/core';
import { AddCircleOutline as AddIcon, Check as YesIcon, Close as NoIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

import { Header } from '../../components';
import { ProductSearchForm } from '../../sections';
import { getProductGroup, searchProduct, createProduct } from '../../api';

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
	}
});

const tableHead = [
	'Product Name',
	'Product Group',
	'Trading Type',
	'Trading Provider',
	'Contract/Warranty From',
	'Contract/Warranty To',
	'In Warranty'
];

class ProductsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
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
				detail: ''
			},
			dialog: {
				open: false,
				pdName: '',
				pdNameError: false,
				pdNameHelperText: '',
				pgCd: '',
				pgCdError: false,
				pgCdHelperText: '',
				tradingType: 'purchase',
				tradingProvider: '',
				warrantyFrom: '',
				warrantyTo: '',
				specification: '',
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
				search: { ...this.state.search, pgList }
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

	handleSearching = () => {
		const { pdCd, pdName, pgCd, tradingType, tradingProvider, inWarranty, spec, detail } = this.state.search;
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
				let rsList = await searchProduct(
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
				pdName: '',
				pdNameError: false,
				pdNameHelperText: '',
				pgCd: '',
				pgCdError: false,
				pgCdHelperText: '',
				tradingType: 'purchase',
				tradingProvider: '',
				warrantyFrom: '',
				warrantyTo: '',
				specification: '',
				detail: ''
			}
		});
	};

	handleOnCreate = () => {
		const {
			pdName,
			pgCd,
			tradingType,
			tradingProvider,
			warrantyFrom,
			warrantyTo,
			specification,
			detail
		} = this.state.dialog;
		if (pgCd === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					pgCdError: true,
					pgCdHelperText: 'Please select product group'
				}
			});
		else if (pdName === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					pdNameError: true,
					pdNameHelperText: 'Please enter product name'
				}
			});
		else {
			createProduct(
				this.props.auth.token,
				this.props.auth.usn,
				{
					pdName,
					pgCd,
					tradingType,
					tradingProvider,
					warrantyFrom,
					warrantyTo,
					specification,
					detail
				},
				(err, success) => {
					if (success) {
						alert('Add Product Success!');
						this.handleDialogToggle();
					} else if (err === 'TimeOut') this.props.signout();
					else if (err === 'Exist') alert('Product code already exists');
					else alert(JSON.stringify(err));
				}
			);
		}
	};

	render() {
		const { classes, match } = this.props;
		const { search, dialog } = this.state;

		const headerButtons = (
			<Button onClick={this.handleDialogToggle} className={classes.rightButton}>
				<AddIcon className={classes.icon} />
				new product
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Products" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<ProductSearchForm
								search={this.state.search}
								handleOnChange={this.handleOnChange}
								handleSearching={this.handleSearching}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<div style={{ padding: '2%' }}>
								<Typography variant="title">Products : {this.state.rsList.length}</Typography>
							</div>
							<Table>
								<TableHead>
									<TableRow>
										{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.rsList.map(pd => (
										<TableRow
											key={pd.pdCd}
											hover
											component={NavLink}
											to={`${match.url}/${pd.pdCd}`}
											style={{ textDecoration: 'none' }}
										>
											<TableCell>{pd.pdName}</TableCell>
											<TableCell>{pd.pgName}</TableCell>
											<TableCell>{pd.tradingType}</TableCell>
											<TableCell>{pd.tradingProvider}</TableCell>
											<TableCell>{pd.warrantyFrom}</TableCell>
											<TableCell>{pd.warrantyTo}</TableCell>
											<TableCell>
												{new Date() <= new Date(pd.warrantyTo) ? (
													<YesIcon color="primary" />
												) : (
													<NoIcon color="error" />
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>
				<Dialog open={dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Product</DialogTitle>
					<DialogContent>
						<Grid container spacing={16}>
							<Grid item xs={12} sm={6}>
								<TextField label="Product Code (Auto)" disabled />
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl
									style={{
										width: 225
									}}
									error={dialog.pgCdError}
								>
									<InputLabel>Product Group</InputLabel>
									<Select value={dialog.pgCd} onChange={this.handleOnChange('dialog', 'pgCd')}>
										{search.pgList.map(pg => (
											<MenuItem key={pg.pgCd} value={pg.pgCd}>
												{pg.pgCd} - {pg.pgName}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{dialog.pgCdHelperText}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Product Name"
									value={dialog.pdName}
									error={dialog.pdNameError}
									helperText={dialog.pdNameHelperText}
									onChange={this.handleOnChange('dialog', 'pdName')}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl>
									<FormLabel>Trading Type</FormLabel>
									<RadioGroup
										value={dialog.tradingType}
										onChange={this.handleOnChange('dialog', 'tradingType')}
									>
										<FormControlLabel value="purchase" control={<Radio />} label="Purchase" />
										<FormControlLabel value="hire" control={<Radio />} label="Hire" />
									</RadioGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Trading Provider"
									value={dialog.tradingProvider}
									onChange={this.handleOnChange('dialog', 'tradingProvider')}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl>
									<FormLabel>Warranty / Contract</FormLabel>
									<TextField
										label="Start Date"
										type="date"
										margin="normal"
										value={dialog.warrantyFrom}
										onChange={this.handleOnChange('dialog', 'warrantyFrom')}
										InputLabelProps={{
											shrink: true
										}}
									/>
									<TextField
										label="End Date"
										type="date"
										margin="normal"
										value={dialog.warrantyTo}
										onChange={this.handleOnChange('dialog', 'warrantyTo')}
										InputLabelProps={{
											shrink: true
										}}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Specification"
									multiline
									rows="10"
									value={dialog.specification}
									onChange={this.handleOnChange('dialog', 'specification')}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
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
						<Button color="primary" onClick={this.handleDialogToggle}>
							cancel
						</Button>
						<Button color="primary" onClick={this.handleOnCreate}>
							create
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

ProductsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProductsPage);
