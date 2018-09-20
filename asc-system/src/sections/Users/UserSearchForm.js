import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const status = [{ key: 'y', value: 'Working' }, { key: 'n', value: 'Quit' }, { key: 'all', value: 'All' }];

const styles = theme => ({
	root: {
		padding: '2%'
	},
	input: {
		width: '80%'
	}
});

const UserSearchForm = ({ ...props }) => {
	const { classes, search, handleOnChange, handleSearching } = props;

	return (
		<Grid container spacing={32} className={classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="headline">Search Users</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Username"
							value={search.username}
							onChange={handleOnChange('search', 'username')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Employee Code"
							value={search.empCode}
							onChange={handleOnChange('search', 'empCode')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="First Name"
							value={search.firstName}
							onChange={handleOnChange('search', 'firstName')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Last Name"
							value={search.lastName}
							onChange={handleOnChange('search', 'lastName')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Branch</InputLabel>
							<Select value={search.branchCd} onChange={handleOnChange('search', 'branchCd')}>
								<MenuItem value="all">All</MenuItem>
								{search.branchList.map((br, idx) => (
									<MenuItem key={idx} value={br.branchCd}>
										{`${br.branchCd} - ${br.branchName}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Division</InputLabel>
							<Select value={search.divCd} onChange={handleOnChange('search', 'divCd')}>
								<MenuItem value="all">All</MenuItem>
								{search.divList.map((br, idx) => (
									<MenuItem key={idx} value={br.divCd}>
										{`${br.divCd} - ${br.divName}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Department</InputLabel>
							<Select value={search.dpmCd} onChange={handleOnChange('search', 'dpmCd')}>
								<MenuItem value="all">All</MenuItem>
								{search.dpmList.map((br, idx) => (
									<MenuItem key={idx} value={br.dpmCd}>
										{`${br.dpmCd} - ${br.dpmName}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Intercom"
							value={search.intercom}
							onChange={handleOnChange('search', 'intercom')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Phone"
							value={search.phone}
							onChange={handleOnChange('search', 'phone')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Email"
							value={search.email}
							onChange={handleOnChange('search', 'email')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Status</InputLabel>
							<Select value={search.active} onChange={handleOnChange('search', 'active')}>
								{status.map(s => (
									<MenuItem key={s.key} value={s.key}>
										{s.value}
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

UserSearchForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserSearchForm);
