import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Tooltip,
	Grid,
	Paper,
	Switch
} from '@material-ui/core';

import {
	AddCircleOutline as AddIcon,
	Settings as EditIcon,
	Save as SaveIcon,
	Block as CancelIcon
} from '@material-ui/icons';

import { Header } from '../../components';
import {
	getApplication,
	createApplication,
	updateApplication
} from '../../api';

import _ from 'lodash';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	root: {
		display: 'flex'
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
	'Application Code',
	'Application Name',
	'Active',
	'Actions'
];

class ApplicationsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			appList: [],
			dialog: {
				open: false,
				appCd: '',
				appCdError: false,
				appCdHelperText: '',
				appName: '',
				appNameError: false,
				appNameHelperText: ''
			},
			editObj: ''
		};
	}

	componentDidMount() {
		(async () => {
			let appList = await getApplication(
				this.props.auth.token,
				(err, result) => {
					if (err)
						if (err === 'TimeOut') this.props.signout();
						else alert(JSON.stringify(err));
					else return result;
				}
			);
			this.setState({
				...this.state,
				appList
			});
		})();
	}

	handleDialogToggle = () => {
		this.setState({
			...this.state,
			dialog: {
				open: !this.state.dialog.open,
				appCd: '',
				appCdError: false,
				appCdHelperText: '',
				appName: '',
				appNameError: false,
				appNameHelperText: ''
			}
		});
	};

	handleDialogOnChange = prop => e => {
		const { value } = e.target;
		this.setState({
			...this.state,
			dialog: { ...this.state.dialog, [prop]: value }
		});
	};

	handleDialogOnCreate = () => {
		const { appCd, appName } = this.state.dialog;
		if (appCd === undefined || appCd === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					appCdError: true,
					appCdHelperText: 'Please Fill Application Code'
				}
			});
			this.appCdInput.focus();
		} else if (appName === undefined || appName === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					appCdError: false,
					appCdHelperText: '',
					appNameError: true,
					appNameHelperText: 'Please Fill Application Name'
				}
			});
			this.appNameInput.focus();
		} else {
			createApplication(
				this.props.auth.token,
				this.props.auth.usn,
				{ appCd, appName, active: 'y' },
				(err, success) => {
					if (success) {
						alert('Add Application Success!');
						this.handleDialogToggle();
						(async () => {
							let appList = await getApplication(
								this.props.auth.token,
								(err, result) => {
									if (err)
										if (err === 'TimeOut') this.props.signout();
										else alert(JSON.stringify(err));
									else return result;
								}
							);
							this.setState({
								...this.state,
								appList
							});
						})();
					} else if (err === 'TimeOut')
						this.props.signout();
					else if (err === 'Exist')
						alert('Application code already exists');
					else alert(JSON.stringify(err));
				}
			);
		}
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(
				this.state.appList,
				n => n.appCd === name
			)
		});
	};

	handleOnChangeEdit = (prop, v = '') => e => {
		const { value } = e.target;
		this.setState({
			...this.state,
			editObj: {
				...this.state.editObj,
				[prop]: v ? v : value
			}
		});
	};

	handleOnSaveEdit = name => {
		const { appCd, appName, active } = this.state.editObj;
		if (appName !== '') {
			(async () => {
				await updateApplication(
					this.props.auth.token,
					this.props.auth.usn,
					{ appCd, appName, active },
					(err, success) => {
						if (err) alert(JSON.stringify(err));
						else alert('Updated');
					}
				);
				let appList = await getApplication(
					this.props.auth.token,
					(err, result) => {
						if (err)
							if (err === 'TimeOut') this.props.signout();
							else alert(JSON.stringify(err));
						else return result;
					}
				);
				this.setState({
					...this.state,
					appList,
					editObj: ''
				});
			})();
		} else alert('Please enter application name');
	};

	handleOnCloseEdit = () => {
		this.setState({
			...this.state,
			editObj: ''
		});
	};

	render() {
		const { classes } = this.props;

		const headerButtons = (
			<Button
				onClick={this.handleDialogToggle}
				className={classes.rightButton}
			>
				<AddIcon className={classes.icon} />
				new Application
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header
					pageTitle="Applications"
					rightButtons={headerButtons}
					signout={this.props.signout}
				/>
				<Dialog
					open={this.state.dialog.open}
					onClose={this.handleDialogToggle}
				>
					<DialogTitle>New Application</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Application Code"
							inputProps={{ maxLength: 5 }}
							inputRef={input =>
								(this.appCdInput = input)
							}
							value={this.state.dialog.appCd}
							error={this.state.dialog.appCdError}
							helperText={
								this.state.dialog.appCdHelperText
							}
							onChange={this.handleDialogOnChange(
								'appCd'
							)}
							required
							autoFocus
						/>
						<br />
						<TextField
							margin="dense"
							label="Application Name"
							inputRef={input =>
								(this.appNameInput = input)
							}
							onChange={this.handleDialogOnChange(
								'appName'
							)}
							value={this.state.dialog.appName}
							error={this.state.dialog.appNameError}
							helperText={
								this.state.dialog.appNameHelperText
							}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.handleDialogToggle}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							onClick={this.handleDialogOnCreate}
							color="primary"
						>
							Create
						</Button>
					</DialogActions>
				</Dialog>

				<Grid
					container
					justify="center"
					className={classes.content}
				>
					<Grid item xs={12}>
						<Grid container justify="center">
							<Grid
								item
								xs={12}
								sm={10}
								md={8}
								className={classes.griditem}
							>
								<div className={classes.toolbar} />
								<Paper className={classes.table}>
									<Table>
										<TableHead>
											<TableRow>
												{tableHead.map(
													(head, key) => (
														<TableCell
															key={key}
														>
															{head}
														</TableCell>
													)
												)}
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.appList.map(
												(app, key) => (
													<TableRow
														key={key}
													>
														<TableCell>
															{
																app.appCd
															}
														</TableCell>
														<TableCell>
															{this
																.state
																.editObj
																.appCd ===
															app.appCd ? (
																<TextField
																	value={
																		this
																			.state
																			.editObj
																			.appName
																	}
																	onChange={this.handleOnChangeEdit(
																		'appName'
																	)}
																	autoFocus
																/>
															) : (
																app.appName
															)}
														</TableCell>
														<TableCell>
															{this
																.state
																.editObj
																.appCd ===
															app.appCd ? (
																<Switch
																	checked={
																		this
																			.state
																			.editObj
																			.active ===
																		'y'
																	}
																	onChange={this.handleOnChangeEdit(
																		'active',
																		this
																			.state
																			.editObj
																			.active ===
																		'y'
																			? 'n'
																			: 'y'
																	)}
																/>
															) : (
																<Switch
																	checked={
																		app.active ===
																		'y'
																	}
																/>
															)}
														</TableCell>
														<TableCell>
															{this
																.state
																.editObj ===
															'' ? (
																<Tooltip
																	title="Edit"
																	placement="top"
																>
																	<Button
																		variant="fab"
																		mini
																		onClick={() =>
																			this.handleOpenEdit(
																				app.appCd
																			)
																		}
																	>
																		<EditIcon />
																	</Button>
																</Tooltip>
															) : this
																.state
																.editObj
																.appCd ===
															app.appCd ? (
																<div>
																	<Tooltip
																		title="Save"
																		placement="top"
																	>
																		<Button
																			variant="fab"
																			mini
																			onClick={() =>
																				this.handleOnSaveEdit(
																					app.appCd
																				)
																			}
																		>
																			<SaveIcon />
																		</Button>
																	</Tooltip>
																	<Tooltip
																		title="Cancel"
																		placement="top"
																	>
																		<Button
																			variant="fab"
																			mini
																			onClick={() =>
																				this.handleOnCloseEdit()
																			}
																		>
																			<CancelIcon />
																		</Button>
																	</Tooltip>
																</div>
															) : (
																''
															)}
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}

ApplicationsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ApplicationsPage);
