import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, TextField, FormControl, Select, MenuItem, Typography } from '@material-ui/core';
import { Save as SaveIcon, Block as CancelIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

import { Header } from '../../components';
import { getAssetAssignment, getBranch, getDivision, getDepartment, updateAssetAssignment } from '../../api';

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
		[theme.breakpoints.down('xs')]: {
			boxShadow: 'none'
		}
	},
	input: {
		width: '80%'
	}
});

class AssignmentDetailEditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			save: false,
			asm: {
				astCd: '',
				username: '',
				branchCd: '',
				divCd: '',
				dpmCd: '',
				a_location: '',
				startDate: '',
				endDate: '',
				detail: ''
			},
			branchList: [],
			divList: [],
			dpmList: []
		};
	}

	componentDidMount() {
		const { astCd, startDate } = this.props.match.params;

		(async () => {
			let asm = await getAssetAssignment(this.props.auth.token, astCd, startDate, (err, result) => {
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
				asm,
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
			asm: { ...this.state.asm, [prop]: value }
		});
	};

	handleOnSave = () => {
		const { token, usn } = this.props.auth;
		const { asm } = this.state;
		if (asm.endDate === '') {
			this.setState({
				...this.state,
				asm: {
					...this.state.asm,
					endDateError: true,
					endDateHelperText: 'Please Enter End Date'
				}
			});
		} else {
			updateAssetAssignment(token, usn, asm, (err, success) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else if (err === 'NoUsername') alert('Username Incorrect');
					else alert(JSON.stringify(err));
				else {
					alert('Updated');
					this.setState({ save: true });
				}
				return;
			});
		}
	};

	render() {
		const { classes } = this.props;
		const { asm, branchList, divList, dpmList } = this.state;

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

		if (this.state.save) return <Redirect to={`/assignment/${asm.astCd}&&${asm.startDate}`} />;

		return (
			<div className={classes.root}>
				<Header pageTitle="Assignment Detail" rightButtons={headerButtons} signout={this.props.signout} />
				<Grid container justify="center" spacing={16} className={classes.content}>
					<Grid item xs={12}>
						<div className={classes.toolbar} />
						<Paper className={classes.main}>
							<Grid container spacing={32}>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Asset Code
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.astCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Username
									</Typography>
									<TextField
										value={asm.username}
										onChange={this.handleOnChange('username')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Branch
									</Typography>
									<FormControl className={classes.input}>
										<Select value={asm.branchCd} onChange={this.handleOnChange('branchCd')}>
											{branchList.map((br, idx) => (
												<MenuItem key={idx} value={br.branchCd}>
													{`${br.branchCd} - ${br.branchName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Division
									</Typography>
									<FormControl className={classes.input}>
										<Select value={asm.divCd} onChange={this.handleOnChange('divCd')}>
											{divList.map((div, idx) => (
												<MenuItem key={idx} value={div.divCd}>
													{`${div.divCd} - ${div.divName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Department
									</Typography>
									<FormControl className={classes.input}>
										<Select value={asm.dpmCd} onChange={this.handleOnChange('dpmCd')}>
											{dpmList.map((dpm, idx) => (
												<MenuItem key={idx} value={dpm.dpmCd}>
													{`${dpm.dpmCd} - ${dpm.dpmName}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Location
									</Typography>
									<TextField
										value={asm.a_location}
										onChange={this.handleOnChange('a_location')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Start Date
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.startDate}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										End Date
									</Typography>
									<TextField
										type="date"
										error={asm.endDateError}
										helperText={asm.endDateHelperText}
										value={asm.endDate}
										onChange={this.handleOnChange('endDate')}
										InputLabelProps={{
											shrink: true
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="title" gutterBottom paragraph>
										Detail
									</Typography>
									<TextField
										multiline
										rows="10"
										value={asm.detail}
										onChange={this.handleOnChange('detail')}
										fullWidth
									/>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

AssignmentDetailEditPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssignmentDetailEditPage);
