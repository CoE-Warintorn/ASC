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
import { getDivision, createDivision, updateDivision } from '../../api';

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

const tableHead = ['Division Code', 'Division Name', 'Actions'];

class DivisionsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			divList: [],
			dialog: {
				open: false,
				divCd: '',
				divCdError: false,
				divCdHelperText: '',
				divName: '',
				divNameError: false,
				divNameHelperText: ''
			},
			editObj: ''
		};
	}

	componentDidMount() {
		(async () => {
			let divList = await getDivision(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				divList
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
		const { divCd, divName } = this.state.dialog;
		if (divCd === undefined || divCd === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					divCdError: true,
					divCdHelperText: 'Please Fill Division Code'
				}
			});
			this.divCdInput.focus();
		} else if (divName === undefined || divName === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					divCdError: false,
					divCdHelperText: '',
					divNameError: true,
					divNameHelperText: 'Please Fill Division Name'
				}
			});
			this.divNameInput.focus();
		} else {
			createDivision(this.props.auth.token, this.props.auth.usn, { divCd, divName }, (err, success) => {
				if (success) {
					alert('Add Division Success!');
					this.handleDialogToggle();
					(async () => {
						let divList = await getDivision(this.props.auth.token, (err, result) => {
							if (err)
								if (err === 'TimeOut') this.props.signout();
								else alert(JSON.stringify(err));
							else return result;
						});
						this.setState({
							...this.state,
							divList
						});
					})();
				} else if (err === 'TimeOut') this.props.signout();
				else if (err === 'Exist') alert('Product division code already exists');
				else alert(JSON.stringify(err));
			});
		}
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(this.state.divList, n => n.divCd === name)
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
		const { divCd, divName } = this.state.editObj;
		if (divName !== '') {
			(async () => {
				await updateDivision(this.props.auth.token, this.props.auth.usn, { divCd, divName }, (err, success) => {
					if (err) alert(JSON.stringify(err));
					else alert('Updated');
				});
				let divList = await getDivision(this.props.auth.token, (err, result) => {
					if (err)
						if (err === 'TimeOut') this.props.signout();
						else alert(JSON.stringify(err));
					else return result;
				});
				this.setState({
					...this.state,
					divList,
					editObj: ''
				});
			})();
		} else alert('Please enter division name');
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
				new division
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Divisions" rightButtons={headerButtons} signout={this.props.signout} />
				<Dialog open={this.state.dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Division</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Division Code"
							inputProps={{ maxLength: 5 }}
							inputRef={input => (this.divCdInput = input)}
							value={this.state.dialog.divCd}
							error={this.state.dialog.divCdError}
							helperText={this.state.dialog.divCdHelperText}
							onChange={this.handleDialogOnChange('divCd')}
							required
							autoFocus
						/>
						<br />
						<TextField
							margin="dense"
							label="Division Name"
							inputRef={input => (this.divNameInput = input)}
							onChange={this.handleDialogOnChange('divName')}
							value={this.state.dialog.divName}
							error={this.state.dialog.divNameError}
							helperText={this.state.dialog.divNameHelperText}
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
											{this.state.divList.map((div, key) => (
												<TableRow key={key}>
													<TableCell>{div.divCd}</TableCell>
													<TableCell>
														{this.state.editObj.divCd === div.divCd ? (
															<TextField
																value={this.state.editObj.divName}
																onChange={this.handleOnChangeEdit('divName')}
																autoFocus
															/>
														) : (
															div.divName
														)}
													</TableCell>
													<TableCell>
														{this.state.editObj === '' ? (
															<Tooltip title="Edit" placement="top">
																<Button
																	variant="fab"
																	mini
																	onClick={() => this.handleOpenEdit(div.divCd)}
																>
																	<EditIcon />
																</Button>
															</Tooltip>
														) : this.state.editObj.divCd === div.divCd ? (
															<div>
																<Tooltip title="Save" placement="top">
																	<Button
																		variant="fab"
																		mini
																		onClick={() => this.handleOnSaveEdit(div.divCd)}
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

DivisionsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(DivisionsPage);
