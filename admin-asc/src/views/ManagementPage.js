import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createUser, getUsers, updateUser } from '../api';

import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControlLabel,
	Checkbox
} from '@material-ui/core';

import { PowerSettingsNew as SignOutIcon, AddCircleOutline as AddIcon } from '@material-ui/icons';

import { Header } from '../components';
import { ManagementSheet } from '../sections';

import _ from 'lodash';
import moment from 'moment';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
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
	}
});

class ManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
			usersList: [],
			editObj: [],
			dialog: {
				open: false,
				usernameError: false,
				usernameHelperText: '',
				startDateError: false,
				startDateHelperText: '',
				endDateError: false,
				endDateHelperText: '',
				adminInd: 'n'
			}
		};
	}

	componentDidMount() {
		(async () => {
			let usersList = await getUsers(this.props.auth.token);
			this.setState({
				...this.state,
				usersList
			});
		})();
	}

	handleSearchChange = e => {
		let text = e.target.value;
		this.setState({ ...this.state, filterText: text });
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(this.state.usersList, n => n.username === name)
		});
	};

	handleOnChangeEdit = (prop, v = '') => (date, e) => {
		if (prop === 'endDate')
			this.setState({
				...this.state,
				editObj: {
					...this.state.editObj,
					[prop]: moment(date).format('YYYY-MM-DD')
				}
			});
		else
			this.setState({
				...this.state,
				editObj: {
					...this.state.editObj,
					[prop]: v ? v : e.target.value
				}
			});
	};

	handleOnSaveEdit = () => {
		const { token, usn } = this.props.auth;

		(async () => {
			await updateUser(token, usn, this.state.editObj, (err, success) => {
				if (err) alert(JSON.stringify(err));
				else alert('Updated');
				return;
			});
			let usersList = await getUsers(token);
			this.setState({
				...this.state,
				usersList,
				editObj: []
			});
		})();
	};

	handleOnCloseEdit = () => {
		this.setState({
			...this.state,
			editObj: []
		});
	};

	handleOnCreate = () => {
		const username = this.usernameInput.value;
		const startDate = this.startDateInput.value;
		const endDate = this.endDateInput.value;
		const adminInd = this.state.dialog.adminInd;
		if (username === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					usernameError: true,
					usernameHelperText: 'Please fill username'
				}
			});
			this.usernameInput.focus();
		} else if (startDate === '') {
			this.setState(prevState => ({
				...this.state,
				dialog: {
					...this.state.dialog,
					startDateError: true,
					startDateHelperText: 'Please fill start date'
				}
			}));
			this.startDateInput.focus();
		} else if (endDate === '') {
			this.setState(prevState => ({
				...this.state,
				dialog: {
					...this.state.dialog,
					endDateError: true,
					endDateHelperText: 'Please fill end date'
				}
			}));
			this.endDateInput.focus();
		} else {
			(async () => {
				await createUser(
					this.props.auth.token,
					this.props.auth.usn,
					{ username, startDate, endDate, adminInd },
					(err, success) => {
						if (success) {
							alert('Add User Success');
							this.handleOnToggle('dialog', 'open')();
						} else if (err === 'TimeOut') this.props.signout();
						else if (err === 'Exist') alert('Username already exists');
						else alert(JSON.stringify(err));
					}
				);
				this.componentDidMount();
			})();
		}
	};

	handleOnToggle = (prop, name, value = '') => () => {
		this.setState({
			...this.state,
			[prop]: {
				...this.state[prop],
				[name]: value ? value : !this.state[prop][name]
			}
		});
	};

	render() {
		const { classes, signout } = this.props;
		const headerButtons = (
			<div>
				<Button onClick={this.handleOnToggle('dialog', 'open')} className={classes.rightButton}>
					<AddIcon className={classes.icon} />
					new user
				</Button>
				<br className={classes.break} />
				<Button className={classes.rightButton} onClick={signout}>
					<SignOutIcon className={classes.icon} />
					sign out
				</Button>
			</div>
		);

		return (
			<div>
				<Header pageTitle="Administrator: User Management" rightButtons={headerButtons} />
				<div className={classes.toolbar} />
				<ManagementSheet
					data={{
						filterText: this.state.filterText,
						usersList: this.state.usersList,
						editObj: this.state.editObj
					}}
					handleSearchChange={this.handleSearchChange}
					handleOpenEdit={this.handleOpenEdit}
					handleOnChangeEdit={this.handleOnChangeEdit}
					handleOnSaveEdit={this.handleOnSaveEdit}
					handleOnCloseEdit={this.handleOnCloseEdit}
				/>

				<Dialog open={this.state.dialog.open} onClose={this.handleOnToggle('dialog', 'open')}>
					<DialogTitle>New User</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Username"
							inputRef={input => (this.usernameInput = input)}
							error={this.state.dialog.usernameError}
							helperText={this.state.dialog.usernameHelperText}
							autoFocus
							fullWidth
						/>
						<br />
						<TextField
							margin="dense"
							label="Start Date"
							type="date"
							inputRef={input => (this.startDateInput = input)}
							error={this.state.dialog.startDateError}
							helperText={this.state.dialog.startDateHelperText}
							fullWidth
							InputLabelProps={{
								shrink: true
							}}
						/>
						<br />
						<TextField
							margin="dense"
							label="End Date"
							type="date"
							inputRef={input => (this.endDateInput = input)}
							error={this.state.dialog.endDateError}
							helperText={this.state.dialog.endDateHelperText}
							fullWidth
							InputLabelProps={{
								shrink: true
							}}
						/>
						<br />
						<FormControlLabel
							label="Admin"
							control={
								<Checkbox
									checked={this.state.dialog.adminInd === 'y'}
									onChange={this.handleOnToggle(
										'dialog',
										'adminInd',
										this.state.dialog.adminInd === 'y' ? 'n' : 'y'
									)}
								/>
							}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleOnToggle('dialog', 'open')} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleOnCreate} color="primary">
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

ManagementPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ManagementPage);
