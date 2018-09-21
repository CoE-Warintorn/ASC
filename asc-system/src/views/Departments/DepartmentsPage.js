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
	Paper
} from '@material-ui/core';

import {
	AddCircleOutline as AddIcon,
	Settings as EditIcon,
	Save as SaveIcon,
	Block as CancelIcon
} from '@material-ui/icons';

import { Header } from '../../components';
import { getDepartment, createDepartment, updateDepartment } from '../../api';

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

const tableHead = ['Department Code', 'Department Name', 'Actions'];

class DepartmentsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dpmList: [],
			dialog: {
				open: false,
				dpmCd: '',
				dpmCdError: false,
				dpmCdHelperText: '',
				dpmName: '',
				dpmNameError: false,
				dpmNameHelperText: ''
			},
			editObj: ''
		};
	}

	componentDidMount() {
		(async () => {
			let dpmList = await getDepartment(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				dpmList
			});
		})();
	}

	handleDialogToggle = () => {
		this.setState({
			...this.state,
			dialog: { open: !this.state.dialog.open }
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
		const { dpmCd, dpmName } = this.state.dialog;
		if (dpmCd === undefined || dpmCd === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					dpmCdError: true,
					dpmCdHelperText: 'Please Fill Department Code'
				}
			});
			this.dpmCdInput.focus();
		} else if (dpmName === undefined || dpmName === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					dpmCdError: false,
					dpmCdHelperText: '',
					dpmNameError: true,
					dpmNameHelperText: 'Please Fill Department Name'
				}
			});
			this.dpmNameInput.focus();
		} else {
			createDepartment(this.props.auth.token, this.props.auth.usn, { dpmCd, dpmName }, (err, success) => {
				if (success) {
					alert('Add Department Success!');
					this.handleDialogToggle();
					(async () => {
						let dpmList = await getDepartment(this.props.auth.token, (err, result) => {
							if (err)
								if (err === 'TimeOut') this.props.signout();
								else alert(JSON.stringify(err));
							else return result;
						});
						this.setState({
							...this.state,
							dpmList
						});
					})();
				} else if (err === 'TimeOut') this.props.signout();
				else if (err === 'Exist') alert('Product department code already exists');
				else alert(JSON.stringify(err));
			});
		}
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(this.state.dpmList, n => n.dpmCd === name)
		});
	};

	handleOnChangeEdit = prop => e => {
		const { value } = e.target;
		this.setState({
			...this.state,
			editObj: {
				...this.state.editObj,
				[prop]: value
			}
		});
	};

	handleOnSaveEdit = name => {
		const { dpmCd, dpmName } = this.state.editObj;
		if (dpmName !== '') {
			(async () => {
				await updateDepartment(this.props.auth.token, this.props.auth.usn, { dpmCd, dpmName }, (err, success) => {
					if (err) alert(JSON.stringify(err));
					else alert('Updated');
				});
				let dpmList = await getDepartment(this.props.auth.token, (err, result) => {
					if (err)
						if (err === 'TimeOut') this.props.signout();
						else alert(JSON.stringify(err));
					else return result;
				});
				this.setState({
					...this.state,
					dpmList,
					editObj: ''
				});
			})();
		} else alert('Please enter department name');
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
			<Button onClick={this.handleDialogToggle} className={classes.rightButton}>
				<AddIcon className={classes.icon} />
				new Department
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Departments" rightButtons={headerButtons} signout={this.props.signout} />
				<Dialog open={this.state.dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Department</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Department Code"
							inputProps={{ maxLength: 5 }}
							inputRef={input => (this.dpmCdInput = input)}
							value={this.state.dialog.dpmCd}
							error={this.state.dialog.dpmCdError}
							helperText={this.state.dialog.dpmCdHelperText}
							onChange={this.handleDialogOnChange('dpmCd')}
							required
							autoFocus
						/>
						<br />
						<TextField
							margin="dense"
							label="Department Name"
							inputRef={input => (this.dpmNameInput = input)}
							onChange={this.handleDialogOnChange('dpmName')}
							value={this.state.dialog.dpmName}
							error={this.state.dialog.dpmNameError}
							helperText={this.state.dialog.dpmNameHelperText}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleDialogToggle} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleDialogOnCreate} color="primary">
							Create
						</Button>
					</DialogActions>
				</Dialog>

				<Grid container justify="center" className={classes.content}>
					<Grid item xs={12}>
						<Grid container justify="center">
							<Grid item xs={12} sm={10} md={6} className={classes.griditem}>
								<div className={classes.toolbar} />
								<Paper className={classes.table}>
									<Table>
										<TableHead>
											<TableRow>
												{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.dpmList.map((div, key) => (
												<TableRow key={key}>
													<TableCell>{div.dpmCd}</TableCell>
													<TableCell>
														{this.state.editObj.dpmCd === div.dpmCd ? (
															<TextField
																value={this.state.editObj.dpmName}
																onChange={this.handleOnChangeEdit('dpmName')}
																autoFocus
															/>
														) : (
															div.dpmName
														)}
													</TableCell>
													<TableCell>
														{this.state.editObj === '' ? (
															<Tooltip title="Edit" placement="top">
																<Button
																	variant="fab"
																	mini
																	onClick={() => this.handleOpenEdit(div.dpmCd)}
																>
																	<EditIcon />
																</Button>
															</Tooltip>
														) : this.state.editObj.dpmCd === div.dpmCd ? (
															<div>
																<Tooltip title="Save" placement="top">
																	<Button
																		variant="fab"
																		mini
																		onClick={() => this.handleOnSaveEdit(div.dpmCd)}
																	>
																		<SaveIcon />
																	</Button>
																</Tooltip>
																<Tooltip title="Cancel" placement="top">
																	<Button
																		variant="fab"
																		mini
																		onClick={() => this.handleOnCloseEdit()}
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
											))}
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

DepartmentsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(DepartmentsPage);
