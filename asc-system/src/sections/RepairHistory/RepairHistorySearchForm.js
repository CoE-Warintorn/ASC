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

const RepairHistorySearchForm = ({ ...props }) => {
	const { classes, search, handleOnChange, handleOnToggle, handleSearching } = props;

	return (
		<Grid container spacing={32} className={classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="headline">Search Repair History</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Asset Code"
							value={search.astCd}
							onChange={handleOnChange('search', 'astCd')}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton>
											<Search onClick={handleOnToggle('asset', 'open')} />
										</IconButton>
									</InputAdornment>
								)
							}}
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
										{pg.pgName}
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
							label="IT Supporter"
							value={search.itSupporter}
							onChange={handleOnChange('search', 'itSupporter')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Repair Date"
							type="date"
							value={search.repairDate}
							onChange={handleOnChange('search', 'repairDate')}
							InputLabelProps={{
								shrink: true
							}}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Return Date"
							type="date"
							value={search.returnDate}
							onChange={handleOnChange('search', 'returnDate')}
							InputLabelProps={{
								shrink: true
							}}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label="Detail" multiline rows="4" value={search.detail} onChange={handleOnChange('search', 'detail')} fullWidth />
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

RepairHistorySearchForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RepairHistorySearchForm);
