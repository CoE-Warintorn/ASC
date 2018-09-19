import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Typography, TextField } from '@material-ui/core';
import { Settings as EditIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { getRepairHistory } from '../../api';

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
	}
});

class RepairHistoryDetailShowPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
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

	render() {
		const { classes } = this.props;
		const { rh } = this.state;

		const headerButtons = (
			<Button color="inherit" component={NavLink} to={`/repairhistory/edit/${rh.astCd}&&${rh.repairDate}`}>
				<EditIcon className={classes.icon} />
				Edit
			</Button>
		);

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
									<Typography variant="subheading" gutterBottom paragraph>
										{rh.itSupporter}
									</Typography>
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
									<Typography variant="subheading" gutterBottom paragraph>
										{rh.returnDate}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="title" gutterBottom paragraph>
										Detail
									</Typography>
									<TextField disabled multiline rows="10" value={rh.detail} fullWidth />
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

RepairHistoryDetailShowPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(RepairHistoryDetailShowPage);
