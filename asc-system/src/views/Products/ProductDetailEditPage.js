import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Button,
	Grid,
	Paper,
	TextField,
	FormControl,
	InputLabel,
	FormLabel,
	Select,
	MenuItem,
	RadioGroup,
	Radio,
	FormControlLabel,
	Typography
} from '@material-ui/core';
import { Save as SaveIcon, Block as CancelIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

import { Header } from '../../components';
import { getProduct, updateProduct, getProductGroup } from '../../api';

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
		padding: '2%',
		height: '100%'
	}
});

class ProductDetailEditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			save: false,
			pd: {
				pdCd: '',
				pdName: '',
				pgCd: '',
				tradingType: '1',
				tradingProvider: '',
				warrantyFrom: '',
				warrantyTo: '',
				specification: '',
				detail: ''
			},
			pgList: []
		};
	}

	componentDidMount() {
		const { pdCd } = this.props.match.params;
		(async () => {
			let pd = await getProduct(this.props.auth.token, pdCd, (err, result) => {
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
				pd,
				pgList
			});
		})();
	}

	handleOnChange = prop => event => {
		const { value } = event.target;
		this.setState({
			...this.state,
			pd: { ...this.state.pd, [prop]: value }
		});
	};

	handleOnSave = () => {
		const { token, usn } = this.props.auth;
		const { pd } = this.state;
		updateProduct(token, usn, pd, (err, success) => {
			if (err)
				if (err === 'TimeOut') this.props.signout();
				else alert(JSON.stringify(err));
			else {
				alert('Updated');
				this.setState({ save: true });
			}
			return;
		});
	};

	render() {
		const { classes } = this.props;
		const { pd, pgList } = this.state;

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

		if (this.state.save) return <Redirect to={`/products/${pd.pdCd}`} />;

		return (
			<div className={classes.root}>
				<Header pageTitle="Product Detail" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<Paper className={classes.main}>
							<Grid container spacing={32}>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Product Code
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.pdCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<FormControl
										style={{
											width: '40%'
										}}
									>
										<InputLabel>Product Group</InputLabel>
										<Select value={pd.pgCd} onChange={this.handleOnChange('pgCd')}>
											{pgList.map(pg => (
												<MenuItem key={pg.pgCd} value={pg.pgCd}>
													{pg.pgName}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Product Name"
										value={pd.pdName}
										onChange={this.handleOnChange('pdName')}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<FormControl>
										<FormLabel>Trading Type</FormLabel>
										<RadioGroup value={pd.tradingType} onChange={this.handleOnChange('tradingType')}>
											<FormControlLabel value="purchase" control={<Radio />} label="Purchase" />
											<FormControlLabel value="hire" control={<Radio />} label="Hire" />
										</RadioGroup>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Trading Provider"
										value={pd.tradingProvider}
										onChange={this.handleOnChange('tradingProvider')}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<FormControl>
										<FormLabel>Warranty / Contract</FormLabel>
										<TextField
											label="Start Date"
											helperText="mm/dd/yyyy"
											type="date"
											margin="normal"
											value={pd.warrantyFrom}
											onChange={this.handleOnChange('warrantyFrom')}
											InputLabelProps={{
												shrink: true
											}}
										/>
										<TextField
											label="End Date"
											helperText="mm/dd/yyyy"
											type="date"
											margin="normal"
											value={pd.warrantyTo}
											onChange={this.handleOnChange('warrantyTo')}
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
										value={pd.specification}
										onChange={this.handleOnChange('specification')}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="Detail"
										multiline
										rows="10"
										value={pd.detail}
										onChange={this.handleOnChange('detail')}
										fullWidth
									/>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

ProductDetailEditPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProductDetailEditPage);
