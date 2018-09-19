import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Settings as EditIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { getUser } from '../../api';

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

class UserDetailShowPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			usr: {
				username: '',
				empCode: '',
				firstName: '',
				lastName: '',
				branchName: '',
				divName: '',
				dpmName: '',
				intercom: '',
				phone: '',
				email: '',
				active: ''
			}
		};
	}

	componentDidMount() {
		const { username } = this.props.match.params;
		(async () => {
			let usr = await getUser(this.props.auth.token, username, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				usr
			});
		})();
	}

	render() {
		const { classes } = this.props;
		const { usr } = this.state;

		const headerButtons = (
			<Button color="inherit" component={NavLink} to={`/users/edit/${usr.username}`}>
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
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Username
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.username}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Employee Code
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.empCode}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										First Name
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.firstName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Last Name
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.lastName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Branch
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.branchName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Division
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.divName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Department
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.dpmName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Intercom
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.intercom}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Phone
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.phone}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Email
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.email}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant="title" gutterBottom paragraph>
										Status
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{usr.active === 'y' ? 'Working' : 'Quit'}
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

UserDetailShowPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(UserDetailShowPage);
