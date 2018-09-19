import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Button,
	Grid,
	Paper,
	TextField,
	Typography,
	InputAdornment,
	IconButton,
	FormControlLabel,
	Checkbox
} from '@material-ui/core';
import { Save as SaveIcon, Block as CancelIcon, Search } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

import { Header, ProductSearchDialog } from '../../components';
import { getAsset, getProductGroup, searchProduct, updateAsset } from '../../api';

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
		[theme.breakpoints.up('md')]: {
			color: 'white'
		}
	},
	icon: {
		marginRight: theme.spacing.unit
	},
	content: {
		padding: theme.spacing.unit * 2
	},
	main: {
		padding: '2%'
	}
});

class AssetDetailEditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			save: false,
			ast: {
				astCd: '',
				pdCd: '',
				serialNumber: '',
				detail: '',
				writeOffDate: '',
				reason: ''
			},
			isWriteOff: false,
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
			}
		};
	}

	componentDidMount() {
		const { astCd } = this.props.match.params;
		(async () => {
			let ast = await getAsset(this.props.auth.token, astCd, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			let pgList = await getProductGroup(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				ast,
				isWriteOff: ast.writeOffDate !== null,
				product: {
					...this.state.product,
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

	handleOnSave = () => {
		const { token, usn } = this.props.auth;
		const { ast } = this.state;

		if (this.state.isWriteOff && ast.writeOffDate === null) {
			this.setState({
				...this.state,
				ast: {
					...this.state.ast,
					writeOffDateError: true,
					writeOffDateHelperText: 'Please Enter Write-Off Date'
				}
			});
		} else if (ast.pdCd === '') {
			this.setState({
				...this.state,
				ast: {
					...this.state.ast,
					pdCdError: true,
					pdCdHelperText: 'Please Enter Product Code'
				}
			});
		} else {
			if (!this.state.isWriteOff) ast.writeOffDate = null;
			updateAsset(token, usn, ast, (err, success) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else {
					alert('Updated');
					this.setState({ save: true });
				}
				return;
			});
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
		this.setState({
			...this.state,
			ast: {
				...this.state.ast,
				pdCd
			},
			product: {
				...this.state.product,
				open: !this.state.product.open
			}
		});
	};

	render() {
		const { classes } = this.props;
		const { ast, product } = this.state;

		const headerButtons = (
			<div>
				<Button color="inherit" onClick={this.handleOnSave}>
					<SaveIcon className={classes.icon} />
					Save
				</Button>
				<Button
					color="inherit"
					onClick={() => {
						this.props.history.goBack();
					}}
				>
					<CancelIcon className={classes.icon} />
					Cancel
				</Button>
			</div>
		);

		if (this.state.save) return <Redirect to={`/assets/${ast.astCd}`} />;

		return (
			<div className={classes.root}>
				<Header pageTitle="Product Detail" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<Paper className={classes.main}>
							<Grid container spacing={32}>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom>
										Asset Code
									</Typography>
									<Typography variant="subheading" gutterBottom>
										{ast.astCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Product Code"
										error={ast.pdCdError}
										helperText={ast.pdCdHelperText}
										value={ast.pdCd}
										onChange={this.handleOnChange('ast', 'pdCd')}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton>
														<Search onClick={this.handleOnToggle('product', 'open')} />
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Serial Number"
										value={ast.serialNumber}
										onChange={this.handleOnChange('ast', 'serialNumber')}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Detail"
										multiline
										rows="10"
										value={ast.detail}
										onChange={this.handleOnChange('ast', 'detail')}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.isWriteOff}
												onChange={() => {
													this.setState({ ...this.state, isWriteOff: !this.state.isWriteOff });
												}}
											/>
										}
										label="Write-Off"
									/>
									<br />
									<br />
									{this.state.isWriteOff ? (
										<TextField
											label="Write-Off Date"
											value={ast.writeOffDate}
											error={ast.writeOffDateError}
											helperText={ast.writeOffDateHelperText}
											type="date"
											onChange={this.handleOnChange('ast', 'writeOffDate')}
											InputLabelProps={{
												shrink: true
											}}
										/>
									) : (
										''
									)}
								</Grid>
								<Grid item xs={12} sm={6}>
									{this.state.isWriteOff ? (
										<TextField
											label="Reason"
											multiline
											rows="10"
											value={ast.reason}
											onChange={this.handleOnChange('ast', 'reason')}
											fullWidth
										/>
									) : (
										''
									)}
								</Grid>
							</Grid>
						</Paper>
					</Grid>

					<ProductSearchDialog
						product={product}
						handleOnChange={this.handleOnChange}
						handleOnSelect={this.handleOnSelect}
						handleProductDialogOnSelect={this.handleProductDialogOnSelect}
						handleProductDialogOnSearch={this.handleProductDialogOnSearch}
						handleOnToggle={this.handleOnToggle}
					/>
				</Grid>
			</div>
		);
	}
}

AssetDetailEditPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssetDetailEditPage);
