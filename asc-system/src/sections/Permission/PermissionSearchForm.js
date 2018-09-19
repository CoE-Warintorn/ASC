import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const styles = theme => ({
	root: {
		padding: '2%'
	},
	input: {
		width: '80%'
	}
});

const PermissionSearchForm = ({ ...props }) => {
	const { classes, search, handleOnChange, handleSearching } = props;

	return (
		<Grid container spacing={32} className={classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="headline">Search Permissions</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField label="Employee Code" value={search.empCode} onChange={handleOnChange('search', 'empCode')} className={classes.input} />
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField label="Username" value={search.username} onChange={handleOnChange('search', 'username')} className={classes.input} />
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Application</InputLabel>
							<Select value={search.appCd} onChange={handleOnChange('search', 'appCd')}>
								<MenuItem value="all"> All </MenuItem>
								{search.appList.map(app => (
									<MenuItem key={app.appCd} value={app.appCd}>
										{app.appCd} - {app.appName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Status</InputLabel>
							<Select value={search.status} onChange={handleOnChange('search', 'status')}>
								{search.statusList.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container justify="center">
					<Grid item>
						<Button variant="contained" color="secondary" onClick={handleSearching}>
							Search
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

PermissionSearchForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PermissionSearchForm);
