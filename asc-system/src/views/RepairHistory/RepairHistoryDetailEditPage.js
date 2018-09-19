import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { Save as SaveIcon, Block as CancelIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

import { Header } from '../../components';
import { getRepairHistory, updateRepairHistory } from '../../api';

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

class RepairHistoryDetailEditPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			save: false,
			rh: {
				astCd: '',
				itSupporter: '',
				repairDate: '',
				returnDate: '',
				detail: ''
			}
		};
	}

	componentDidMount() {
		const { astCd, repairDate } = this.props.match.params;

		(async () => {
			let rh = await getRepairHistory(this.props.auth.token, astCd, repairDate, (err, result) => {
				if (err)
					if (err === 'TimeOut') this.props.signout();
					else alert(JSON.stringify(err));
				else return result;
			});
			this.setState({
				...this.state,
				rh
			});
		})();
	}

	handleOnChange = prop => event => {
		const { value } = event.target;
		this.setState({
			...this.state,
			rh: { ...this.state.rh, [prop]: value }
		});
	};

	handleOnSave = () => {
		const { token, usn } = this.props.auth;
		const { rh } = this.state;
		if (rh.itSupporter === '') {
			this.setState({
				...this.state,
				rh: {
					...this.state.ast,
					itSupporterError: true,
					itSupporterHelperText: 'Please Enter IT Supporter'
				}
			});
		} else {
			rh.returnDate = rh.returnDate === '' ? null : rh.returnDate;
			updateRepairHistory(token, usn, rh, (err, success) => {
				if (err)
					if (err === 'NoUsername') alert('IT Supporter Incorrect');
					else if (err === 'TimeOut') this.props.signout();
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
		const { rh } = this.state;

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

		if (this.state.save) return <Redirect to={`/repairhistory/${rh.astCd}&&${rh.repairDate}`} />;

		return (
			<div className={classes.root}>
				<Header pageTitle="Repair History Detail" rightButtons={headerButtons} signout={this.props.signout} />
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
										{rh.astCd}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										IT Supporter
									</Typography>
									<TextField
										value={rh.itSupporter}
										error={rh.itSupporterError}
										helperText={rh.itSupporterHelperText}
										onChange={this.handleOnChange('itSupporter')}
										className={classes.input}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Repair Date
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{rh.repairDate}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Return Date
									</Typography>
									<TextField
										type="date"
										helperText="month / day / year"
										value={rh.returnDate}
										onChange={this.handleOnChange('returnDate')}
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
										value={rh.detail}
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

RepairHistoryDetailEditPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(RepairHistoryDetailEditPage);
