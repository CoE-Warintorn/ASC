import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Settings as EditIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { getAsset } from '../../api';

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
		height: '100%',
		[theme.breakpoints.down('xs')]: {
			boxShadow: 'none'
		}
	}
});

class AssetDetailShowPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ast: {
				astCd: '',
				pdCd: '',
				serialNumber: '',
				detail: '',
				writeOffDate: null,
				reason: null
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
			this.setState({
				...this.state,
				ast
			});
		})();
	}

	render() {
		const { classes } = this.props;
		const { ast } = this.state;

		const headerButtons = (
			<Button color="inherit" component={NavLink} to={`/assets/edit/${ast.astCd}`}>
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
										Asset Code
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{ast.astCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Product Code
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{ast.pdCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Serial Number
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{ast.serialNumber}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Detail
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{ast.detail}
									</Typography>
								</Grid>
								{ast.writeOffDate !== null ? (
									<Grid item xs={12} sm={6}>
										<Typography variant="title" gutterBottom paragraph>
											Write-Off Date
										</Typography>
										<Typography variant="subheading" gutterBottom paragraph>
											{ast.writeOffDate}
										</Typography>
									</Grid>
								) : (
									''
								)}
								{ast.writeOffDate !== null ? (
									<Grid item xs={12} sm={6}>
										<Typography variant="title" gutterBottom paragraph>
											Reason
										</Typography>
										<Typography variant="subheading" gutterBottom paragraph>
											{ast.reason}
										</Typography>
									</Grid>
								) : (
									''
								)}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

AssetDetailShowPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssetDetailShowPage);
