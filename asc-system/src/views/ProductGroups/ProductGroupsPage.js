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
import { getProductGroup, createProductGroup, updateProductGroup } from '../../api';

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

const tableHead = ['Product Group Code', 'Product Group Name', 'Actions'];

class ProductGroupsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pgList: [],
			dialog: {
				open: false,
				pgCd: '',
				pgCdError: false,
				pgCdHelperText: '',
				pgName: '',
				pgNameError: false,
				pgNameHelperText: ''
			},
			editObj: ''
		};
	}

	componentDidMount() {
		(async () => {
			let pgList = await getProductGroup(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});

			this.setState({
				...this.state,
				pgList
			});
		})();
	}

	handleDialogToggle = () => {
		this.setState({
			...this.state,
			dialog: {
				open: !this.state.dialog.open,
				pgCd: '',
				pgCdError: false,
				pgCdHelperText: '',
				pgName: '',
				pgNameError: false,
				pgNameHelperText: ''
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
		let pgCd = this.state.dialog.pgCd;
		let pgName = this.state.dialog.pgName;
		if (pgCd === undefined || pgCd === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					pgCdError: true,
					pgCdHelperText: 'Please Fill Product Group Code'
				}
			});
			this.pgCdInput.focus();
		} else if (pgName === undefined || pgName === '') {
			this.setState({
				...this.state,
				dialog: {
					...this.state.dialog,
					pgCdError: false,
					pgCdHelperText: '',
					pgNameError: true,
					pgNameHelperText: 'Please Fill Product Group Name'
				}
			});
			this.pgNameInput.focus();
		} else {
			createProductGroup(this.props.auth.token, this.props.auth.usn, { pgCd, pgName }, (err, success) => {
				if (success) {
					alert('Add Product Group Success!');
					this.handleDialogToggle();
					(async () => {
						let pgList = await getProductGroup(this.props.auth.token, (err, result) => {
							if (err)
								if (err === 'TimeOut') this.props.signout();
								else alert(JSON.stringify(err));
							else return result;
						});
						this.setState({
							...this.state,
							pgList
						});
					})();
				} else if (err === 'TimeOut') this.props.signout();
				else if (err === 'Exist') alert('Product group code already exists');
				else alert(JSON.stringify(err));
			});
		}
	};

	handleOpenEdit = name => {
		this.setState({
			...this.state,
			editObj: _.find(this.state.pgList, n => n.pgCd === name)
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
		const { pgCd, pgName } = this.state.editObj;
		if (pgName !== '') {
			(async () => {
				await updateProductGroup(this.props.auth.token, this.props.auth.usn, { pgCd, pgName }, (err, success) => {
					if (err) alert(JSON.stringify(err));
					else alert('Updated');
				});
				let pgList = await getProductGroup(this.props.auth.token, (err, result) => {
					if (err)
						if (err === 'TimeOut') this.props.signout();
						else alert(JSON.stringify(err));
					else return result;
				});
				this.setState({
					...this.state,
					pgList,
					editObj: ''
				});
			})();
		} else alert('Please enter product group name');
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
				new group
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Product Groups" rightButtons={headerButtons} signout={this.props.signout} />
				<Dialog open={this.state.dialog.open} onClose={this.handleDialogToggle}>
					<DialogTitle>New Product Group</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Product Group Code"
							inputProps={{ maxLength: 5 }}
							inputRef={input => (this.pgCdInput = input)}
							value={this.state.dialog.pgCd}
							error={this.state.dialog.pgCdError}
							helperText={this.state.dialog.pgCdHelperText}
							onChange={this.handleDialogOnChange('pgCd')}
							required
							autoFocus
						/>
						<br />
						<TextField
							margin="dense"
							label="Product Group Name"
							inputRef={input => (this.pgNameInput = input)}
							onChange={this.handleDialogOnChange('pgName')}
							value={this.state.dialog.pgName}
							error={this.state.dialog.pgNameError}
							helperText={this.state.dialog.pgNameHelperText}
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
											{this.state.pgList.map((pg, key) => (
												<TableRow key={key}>
													<TableCell>{pg.pgCd}</TableCell>
													<TableCell>
														{this.state.editObj.pgCd === pg.pgCd ? (
															<TextField
																value={this.state.editObj.pgName}
																onChange={this.handleOnChangeEdit('pgName')}
																autoFocus
															/>
														) : (
															pg.pgName
														)}
													</TableCell>
													<TableCell>
														{this.state.editObj === '' ? (
															<Tooltip title="Edit" placement="top">
																<Button
																	variant="fab"
																	mini
																	onClick={() => this.handleOpenEdit(pg.pgCd)}
																>
																	<EditIcon />
																</Button>
															</Tooltip>
														) : this.state.editObj.pgCd === pg.pgCd ? (
															<div>
																<Tooltip title="Save" placement="top">
																	<Button
																		variant="fab"
																		mini
																		onClick={() => this.handleOnSaveEdit(pg.pgCd)}
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

ProductGroupsPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProductGroupsPage);
