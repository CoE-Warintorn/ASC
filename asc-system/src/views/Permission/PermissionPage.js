import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Grid, Paper, Switch } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { PermissionSearchForm } from '../../sections';
import { getApplication, searchPermission, addPermission, deletePermission } from '../../api';

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
	}
});

const tableHead = ['Employee Code', 'Username', 'Applications', 'Permission'];

class PermissionPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: {
				empCode: '',
				username: '',
				appCd: '',
				status: 'all',
				appList: [],
				statusList: [{ key: 'all', name: 'All' }, { key: 'on', name: 'ON' }, { key: 'off', name: 'OFF' }]
			},
			rsList: []
		};
	}

	componentDidMount() {
		(async () => {
			let appList = await getApplication(this.props.auth.token, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				search: {
					...this.state.search,
					appList
				}
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

	handleSearching = () => {
		const { empCode, username, appCd, status } = this.state.search;
		if (empCode !== '' || username !== '' || appCd !== '') {
			(async () => {
				let rsList = await searchPermission(
					this.props.auth.token,
					{
						empCode,
						username,
						appCd,
						status
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

	handleOnToggle = (username, appCd, permission) => () => {
		const { token, usn } = this.props.auth;
		if (!permission)
			addPermission(token, usn, { username, appCd }, (err, success) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else this.handleSearching();
			});
		else
			deletePermission(token, usn, { username, appCd }, (err, success) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else this.handleSearching();
			});
	};

	render() {
		const { classes } = this.props;

		const headerButtons = (
			<Button
				className={classes.rightButton}
				component={NavLink}
				to={`/applications`}
				style={{ textDecoration: 'none' }}
			>
				<Settings className={classes.icon} />
				manage applications
			</Button>
		);

		return (
			<div className={classes.root}>
				<Header pageTitle="Permission" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<br />
						<Paper>
							<PermissionSearchForm
								search={this.state.search}
								handleOnChange={this.handleOnChange}
								handleSearching={this.handleSearching}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<Paper className={classes.table}>
							<Table>
								<TableHead>
									<TableRow>
										{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.rsList.map((p, idx) => (
										<TableRow key={idx} hover>
											<TableCell>{p.empCode}</TableCell>
											<TableCell>{p.username}</TableCell>
											<TableCell>{p.appName}</TableCell>
											<TableCell>
												<Switch
													checked={p.permission}
													onChange={this.handleOnToggle(p.username, p.appCd, p.permission)}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

PermissionPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(PermissionPage);
