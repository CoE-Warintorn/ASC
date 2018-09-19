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
import { getBranch, createBranch, updateBranch } from '../../api';

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

const tableHead = ['Branch Code', 'Branch Name', 'Actions'];

class BranchesPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			branchList: [],
			dialog: {
				open: false,
				branchCd: '',
				branchCdError: false,
				branchCdHelperText: '',
				branchName: '',
				branchNameError: false,
				branchNameHelperText: ''
			},
			editObj: ''
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
			this.setState({
				...this.state,
				branchList
			});
		})();
	}

	handleDialogToggle = () => {
		this.setState({
			...this.state,
			dialog: {
				open: !this.state.dialog.open,
				branchCd: '',
				branchCdError: false,
				branchCdHelperText: '',
				branchName: '',
				branchNameError: false,
				branchNameHelperText: ''
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

	handleDialogOnClick = () => {
		const { branchCd, branchName } = this.state.dialog;
		if (branchCd === undefined || branchCd === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					branchCdError: true,
					branchCdHelperText: 'Please Fill Branch Code'
				}
			});
			this.branchCdInput.focus();
		} else if (branchName === undefined || branchName === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					branchCdError: false,
					branchCdHelperText: '',
					branchNameError: true,
					branchNameHelperText: 'Please Fill Branch Name'
				}
			});
			this.branchNameInput.focus();
		} else {
			createBranch(this.props.auth.token, this.props.auth.usn, { branchCd, branchName }, (err, success) => {
				if (success) {
					alert('Add Branch Success!');
					this.handleDialogToggle();
					(async () => {
						let branchList = await getBranch(this.props.auth.token);
						this.setState({
							...this.state,
							branchList
						});
					})();
				} else if (err === 'TimeOut') this.props.signout();
				else if (err === 'Exist') alert('Product branch code already exists');
				else alert(JSON.stringify(err));
			});
		}
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(this.state.branchList, n => n.branchCd === name)
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
		const { branchCd, branchName } = this.state.editObj;
		if (branchName !== '') {
			(async () => {
				await updateBranch(this.props.auth.token, this.props.auth.usn, { branchCd, branchName }, (err, success) => {
					if (err) alert(JSON.stringify(err));
					else alert('Updated');
					return;
				});
				let branchList = await getBranch(this.props.auth.token);
				this.setState({
					...this.state,
					branchList,
					editObj: ''
				});
			})();
		} else alert('Please enter branch name');
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
				new branch
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Branches" rightButtons={headerButtons} signout={this.props.signout} />
				<Dialog open={this.state.dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Branch</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Branch Code"
							inputProps={{ maxLength: 5 }}
							inputRef={input => (this.branchCdInput = input)}
							value={this.state.dialog.branchCd}
							error={this.state.dialog.branchCdError}
							helperText={this.state.dialog.branchCdHelperText}
							onChange={this.handleDialogOnChange('branchCd')}
							required
							autoFocus
						/>
						<br />
						<TextField
							margin="dense"
							label="Branch Name"
							inputRef={input => (this.branchNameInput = input)}
							onChange={this.handleDialogOnChange('branchName')}
							value={this.state.dialog.branchName}
							error={this.state.dialog.branchNameError}
							helperText={this.state.dialog.branchNameHelperText}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleDialogToggle} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleDialogOnClick} color="primary">
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
											{this.state.branchList.map((br, key) => (
												<TableRow key={key}>
													<TableCell>{br.branchCd}</TableCell>
													<TableCell>
														{this.state.editObj.branchCd === br.branchCd ? (
															<TextField
																value={this.state.editObj.branchName}
																onChange={this.handleOnChangeEdit('branchName')}
																autoFocus
															/>
														) : (
															br.branchName
														)}
													</TableCell>
													<TableCell>
														{this.state.editObj === '' ? (
															<Tooltip title="Edit" placement="top">
																<Button
																	variant="fab"
																	mini
																	onClick={() => this.handleOpenEdit(br.branchCd)}
																>
																	<EditIcon />
																</Button>
															</Tooltip>
														) : this.state.editObj.branchCd === br.branchCd ? (
															<div>
																<Tooltip title="Save" placement="top">
																	<Button
																		variant="fab"
																		mini
																		onClick={() => this.handleOnSaveEdit(br.branchCd)}
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

BranchesPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(BranchesPage);
