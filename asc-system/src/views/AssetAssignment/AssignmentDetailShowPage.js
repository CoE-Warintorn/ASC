import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Typography, TextField } from '@material-ui/core';
import { Settings as EditIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

import { Header } from '../../components';
import { getAssetAssignment } from '../../api';

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

class AssignmentDetailShowPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			asm: {
				astCd: '',
				username: '',
				branchName: '',
				divName: '',
				dpmName: '',
				a_location: '',
				startDate: '',
				endDate: '',
				detail: ''
			}
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
			if (asm !== undefined)
				this.setState({
					...this.state,
					asm
				});
			else alert('Server Error');
		})();
	}

	render() {
		const { classes } = this.props;
		const { asm } = this.state;

		const headerButtons = (
			<Button color="inherit" component={NavLink} to={`/assignment/edit/${asm.astCd}&&${asm.startDate}`}>
				<EditIcon className={classes.icon} />
				Edit
			</Button>
		);

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
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.username}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Branch
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.branchName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Division
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.divName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Department
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.dpmName}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="title" gutterBottom paragraph>
										Location
									</Typography>
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.a_location}
									</Typography>
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
									<Typography variant="subheading" gutterBottom paragraph>
										{asm.endDate}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="title" gutterBottom paragraph>
										Detail
									</Typography>
									<TextField disabled multiline rows="10" value={asm.detail} fullWidth />
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

AssignmentDetailShowPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AssignmentDetailShowPage);
