import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Settings as EditIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { getProduct } from '../../api';

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
		// height: '100%',
		[theme.breakpoints.down('xs')]: {
			boxShadow: 'none'
		}
	}
});

class ProductDetailShowPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pd: {
				pdCd: '',
				pdName: '',
				pgName: '',
				tradingType: '1',
				tradingProvider: '',
				warrantyFrom: '',
				warrantyTo: '',
				specification: '',
				detail: ''
			}
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
			this.setState({
				...this.state,
				pd
			});
		})();
	}

	render() {
		const { classes } = this.props;
		const { pd } = this.state;

		const headerButtons = (
			<Button color="inherit" component={NavLink} to={`/products/edit/${pd.pdCd}`}>
				<EditIcon className={classes.icon} />
				Edit
			</Button>
		);

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
									<Typography variant="title" gutterBottom paragraph>
										Product Name
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.pdName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Product Group
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.pgName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Trading Type
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.tradingType ? 'Purchase' : 'Hire'}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Trading Provider
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.tradingProvider}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Warranty / Contract
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										Start Date: {pd.warrantyFrom}
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										End Date: {pd.warrantyTo}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Specification
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.specification}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Detail
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{pd.detail}
									</Typography>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

ProductDetailShowPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProductDetailShowPage);
