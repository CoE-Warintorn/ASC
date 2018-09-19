import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Grid,
	Button,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	IconButton,
	FormControlLabel,
	Checkbox
} from '@material-ui/core';
import { Search } from '@material-ui/icons';

const styles = theme => ({
	root: {
		padding: '2%'
	},
	input: {
		width: '80%'
	}
});

const AssignmentSearchForm = ({ ...props }) => {
	const { classes, search, handleOnChange, handleOnToggle, handleSearching } = props;

	return (
		<Grid container spacing={32} className={classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="headline">Search Asset Assignment</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Asset Code"
							value={search.astCd}
							onChange={handleOnChange('search', 'astCd')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Product Group</InputLabel>
							<Select value={search.pgCd} onChange={handleOnChange('search', 'pgCd')}>
								<MenuItem value="all"> All </MenuItem>
								{search.pgList.map(pg => (
									<MenuItem key={pg.pgCd} value={pg.pgCd}>
										{pg.pgCd} - {pg.pgName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Product Code"
							value={search.pdCd}
							onChange={handleOnChange('search', 'pdCd')}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton>
											<Search onClick={handleOnToggle('product', 'open')} />
										</IconButton>
									</InputAdornment>
								)
							}}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Serial Number"
							value={search.serialNumber}
							onChange={handleOnChange('search', 'serialNumber')}
							className={classes.input}
						/>
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
						<FormControl className={classes.input}>
							<InputLabel>Branch</InputLabel>
							<Select value={search.branchCd} onChange={handleOnChange('search', 'branchCd')}>
								<MenuItem value="all"> All </MenuItem>
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
								<MenuItem value="all"> All </MenuItem>
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
								<MenuItem value="all"> All </MenuItem>
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
							label="Location"
							value={search.a_location}
							onChange={handleOnChange('search', 'a_location')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Asset Detail"
							multiline
							rows="4"
							value={search.astDetail}
							onChange={handleOnChange('search', 'astDetail')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Detail"
							multiline
							rows="4"
							value={search.detail}
							onChange={handleOnChange('search', 'detail')}
							className={classes.input}
						/>
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
					<Grid item xs={12} sm={6} md={3}>
						<FormControlLabel
							control={<Checkbox checked={search.showHistory} />}
							label="Show History"
							onChange={handleOnToggle('search', 'showHistory')}
						/>
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

AssignmentSearchForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AssignmentSearchForm);
