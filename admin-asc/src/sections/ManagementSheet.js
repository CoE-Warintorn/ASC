import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import { Table } from '../components';

import _ from 'lodash';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
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
	root: {
		flexGrow: 1
	},
	head: {
		padding: '20px 5%'
	},
	body: {
		padding: '0 5%'
	},
	tableWrapper: {
		overflowX: 'auto',
		width: '100%'
	}
});

const ManagementSheet = ({ ...props }) => {
	const { classes, handleSearchChange, handleOpenEdit, handleOnChangeEdit, handleOnSaveEdit, handleOnCloseEdit } = props;
	const { filterText, usersList, editObj } = props.data;
	return (
		<div>
			<Grid container className={classes.root} spacing={8}>
				<Grid item xs={12}>
					<Grid
						container
						className={classes.head}
						alignItems="center"
						// direction='column'
						justify="flex-start"
					>
						<TextField
							margin="normal"
							label="Search Username"
							value={filterText}
							onChange={handleSearchChange}
							InputProps={{
								endAdornment: <SearchIcon />
							}}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container className={classes.body} alignItems="center" justify="center">
						<Paper className={classes.tableWrapper}>
							<Table
								tableHead={['Username', 'Admin', 'Start Date', 'End Date', 'Status', 'Actions']}
								tableData={_.filter(usersList, n => n.username.search(new RegExp(filterText, 'i')) >= 0)}
								editObj={editObj}
								handleOpenEdit={handleOpenEdit}
								handleOnChangeEdit={handleOnChangeEdit}
								handleOnSaveEdit={handleOnSaveEdit}
								handleOnCloseEdit={handleOnCloseEdit}
							/>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

ManagementSheet.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ManagementSheet);
