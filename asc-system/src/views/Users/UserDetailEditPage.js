import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';
import { Save as SaveIcon, Block as CancelIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

import { Header } from '../../components';
import { getUser, updateUser, getBranch, getDivision, getDepartment } from '../../api';

const status = [{ key: 'y', value: 'Working' }, { key: 'n', value: 'Quit' }];

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
	},
	input: {
		width: '80%'
	}
});

class UserDetailEditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			save: false,
			usr: {
				username: '',
				empCode: '',
				firstName: '',
				lastName: '',
				branchCd: '',
				divCd: '',
				dpmCd: '',
				intercom: '',
				phone: '',
				email: '',
				active: ''
			},
			branchList: [],
			divList: [],
			dpmList: []
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
				usr,
				branchList,
				divList,
				dpmList
			});
		})();
	}

	handleOnChange = prop => event => {
		const { value } = event.target;
		this.setState({
			...this.state,
			usr: { ...this.state.usr, [prop]: value }
		});
	};

	handleOnSave = () => {
		const {
			username,
			empCode,
			firstName,
			lastName,
			branchCd,
			divCd,
			dpmCd,
			intercom,
			phone,
			email,
			active
		} = this.state.usr;
		const { token, usn } = this.props.auth;

		if (empCode === '')
			this.setState({
				...this.state,
				usr: {
					...this.state.usr,
					empCodeError: true,
					empCodeHelperText: 'Please enter username'
				}
			});
		else if (firstName === '')
			this.setState({
				...this.state,
				usr: {
					...this.state.usr,
					empCodeError: false,
					empCodeHelperText: '',
					firstNameError: true,
					firstNameHelperText: 'Please enter first name'
				}
			});
		else if (lastName === '')
			this.setState({
				...this.state,
				usr: {
					...this.state.usr,
					empCodeError: false,
					empCodeHelperText: '',
					firstNameError: false,
					firstNameHelperText: '',
					lastNameError: true,
					lastNameHelperText: 'Please enter last name'
				}
			});
		else
			updateUser(
				token,
				usn,
				{
					username,
					empCode,
					firstName,
					lastName,
					branchCd,
					divCd,
					dpmCd,
					intercom,
					phone,
					email,
					active
				},
				(err, success) => {
					if (err)
						if (err === 'TimeOut') this.props.signout();
						else alert(JSON.stringify(err));
					else {
						alert('Updated');
						this.setState({ save: true });
					}
					return;
				}
			);
	};

	render() {
		const { classes } = this.props;
		const { usr } = this.state;

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

		if (this.state.save) return <Redirect to={`/users/${usr.username}`} />;

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
									<TextField
										label="Employee Code"
										error={usr.empCodeError}
										helperText={usr.empCodeHelperText}
										value={usr.empCode}
										onChange={this.handleOnChange('empCode')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="First Name"
										error={usr.firstNameError}
										helperText={usr.firstNameHelperText}
										value={usr.firstName}
										onChange={this.handleOnChange('firstName')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Last Name"
										error={usr.lastNameError}
										helperText={usr.lastNameHelperText}
										value={usr.lastName}
										onChange={this.handleOnChange('lastName')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl className={classes.input}>
										<InputLabel>Branch</InputLabel>
										<Select value={usr.branchCd} onChange={this.handleOnChange('branchCd')}>
											{this.state.branchList.map((br, idx) => (
												<MenuItem key={idx} value={br.branchCd}>
													{`${br.branchCd} - ${br.branchName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl className={classes.input}>
										<InputLabel>Division</InputLabel>
										<Select value={usr.divCd} onChange={this.handleOnChange('divCd')}>
											{this.state.divList.map((br, idx) => (
												<MenuItem key={idx} value={br.divCd}>
													{`${br.divCd} - ${br.divName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl className={classes.input}>
										<InputLabel>Department</InputLabel>
										<Select value={usr.dpmCd} onChange={this.handleOnChange('dpmCd')}>
											{this.state.dpmList.map((br, idx) => (
												<MenuItem key={idx} value={br.dpmCd}>
													{`${br.dpmCd} - ${br.dpmName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Intercom"
										value={usr.intercom}
										onChange={this.handleOnChange('intercom')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Phone"
										value={usr.phone}
										onChange={this.handleOnChange('phone')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										label="Email"
										value={usr.email}
										onChange={this.handleOnChange('email')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl className={classes.input}>
										<InputLabel>Status</InputLabel>
										<Select value={usr.active} onChange={this.handleOnChange('active')}>
											{status.map(s => (
												<MenuItem key={s.key} value={s.key}>
													{s.value}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

UserDetailEditPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(UserDetailEditPage);
