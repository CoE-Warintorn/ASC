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
	InputLabel,
	Select,
	MenuItem,
	Typography
} from '@material-ui/core';
import { AddCircleOutline as AddIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { UserSearchForm } from '../../sections';
import { getBranch, getDivision, getDepartment, createUser, searchUser } from '../../api';

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

const tableHead = ['Username', 'Employee Code', 'Branch', 'Department', 'Division', 'Status'];

class UsersPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
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
				active: 'y',
				branchList: [],
				divList: [],
				dpmList: []
			},
			dialog: {
				open: false,
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
			rsList: []
		};
	}

	componentDidMount() {
		(async () => {
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
				search: { ...this.state.search, branchList, divList, dpmList }
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

	handleOnSelect = prop => e => {
		this.setState({
			...this.state,
			search: {
				...this.state.search,
				[prop]: {
					key: e.currentTarget.getAttribute('data-key'),
					value: e.currentTarget.getAttribute('data-value')
				}
			}
		});
	};

	handleSearching = () => {
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
		} = this.state.search;
		if (
			username !== '' ||
			empCode !== '' ||
			firstName !== '' ||
			lastName !== '' ||
			branchCd !== '' ||
			divCd !== '' ||
			dpmCd !== '' ||
			intercom !== '' ||
			phone !== '' ||
			email !== ''
		) {
			(async () => {
				let rsList = await searchUser(
					this.props.auth.token,
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
				active: 'y'
			}
		});
	};

	handleOnCreate = () => {
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
		} = this.state.dialog;
		if (username === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					usernameError: true,
					usernameHelperText: 'Please enter username'
				}
			});
		else if (empCode === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					usernameError: false,
					usernameHelperText: '',
					empCodeError: true,
					empCodeHelperText: 'Please enter employee code'
				}
			});
		else if (firstName === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					usernameError: false,
					usernameHelperText: '',
					empCodeError: false,
					empCodeHelperText: '',
					firstNameError: true,
					firstNameHelperText: 'Please enter first name'
				}
			});
		else if (lastName === '')
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					usernameError: false,
					usernameHelperText: '',
					empCodeError: false,
					empCodeHelperText: '',
					firstNameError: false,
					firstNameHelperText: '',
					lastNameError: true,
					lastNameHelperText: 'Please enter last name'
				}
			});
		else {
			createUser(
				this.props.auth.token,
				this.props.auth.usn,
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
					if (success) {
						alert('Add User Success!');
						this.handleDialogToggle();
					} else if (err === 'TimeOut') this.props.signout();
					else if (err === 'Exist') alert('Username already exists');
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
				new user
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Users" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<UserSearchForm
								search={this.state.search}
								handleOnChange={this.handleOnChange}
								handleOnSelect={this.handleOnSelect}
								handleSearching={this.handleSearching}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<div style={{ padding: '2%' }}>
								<Typography variant="title">Users : {this.state.rsList.length}</Typography>
							</div>
							<Table>
								<TableHead>
									<TableRow>
										{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.rsList.map(usr => (
										<TableRow
											key={usr.username}
											hover
											component={NavLink}
											to={`${match.url}/${usr.username}`}
											style={{ textDecoration: 'none' }}
										>
											<TableCell>{usr.username}</TableCell>
											<TableCell>{usr.empCode}</TableCell>
											<TableCell>{usr.branchName}</TableCell>
											<TableCell>{usr.divName}</TableCell>
											<TableCell>{usr.dpmName}</TableCell>
											<TableCell>{usr.active === 'y' ? 'Working' : 'Quit'}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>

				<Dialog open={dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New User</DialogTitle>
					<DialogContent>
						<Grid container spacing={16}>
							<Grid item xs={12}>
								<Typography variant="headline">Search Users</Typography>
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
								<TextField
									label="Employee Code"
									error={dialog.empCodeError}
									helperText={dialog.empCodeHelperText}
									value={dialog.empCode}
									onChange={this.handleOnChange('dialog', 'empCode')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="First Name"
									error={dialog.firstNameError}
									helperText={dialog.firstNameHelperText}
									value={dialog.firstName}
									onChange={this.handleOnChange('dialog', 'firstName')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Last Name"
									error={dialog.lastNameError}
									helperText={dialog.lastNameHelperText}
									value={dialog.lastName}
									onChange={this.handleOnChange('dialog', 'lastName')}
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
									label="Intercom"
									value={dialog.intercom}
									onChange={this.handleOnChange('dialog', 'intercom')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Phone"
									value={dialog.phone}
									onChange={this.handleOnChange('dialog', 'phone')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Email"
									value={dialog.email}
									onChange={this.handleOnChange('dialog', 'email')}
									className={classes.input}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl className={classes.input}>
									<InputLabel>Status</InputLabel>
									<Select value={dialog.active} onChange={this.handleOnChange('dialog', 'active')}>
										<MenuItem value={'y'}>Working</MenuItem>
										<MenuItem value={'n'}>Quit</MenuItem>
									</Select>
								</FormControl>
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
			</div>
		);
	}
}

UsersPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(UsersPage);
