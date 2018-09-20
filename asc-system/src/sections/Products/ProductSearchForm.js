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

const ProductSearchForm = ({ ...props }) => {
	const { classes, search, handleOnChange, handleSearching } = props;

	return (
		<Grid container spacing={32} className={classes.root}>
			<Grid item xs={12}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="headline">Search Products</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Product Code"
							value={search.pdCd}
							onChange={handleOnChange('search', 'pdCd')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Product Name"
							value={search.pdName}
							onChange={handleOnChange('search', 'pdName')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Product Group</InputLabel>
							<Select value={search.pgCd} onChange={handleOnChange('search', 'pgCd')}>
								<MenuItem value="all"> All </MenuItem>
								{search.pgList.map(n => (
									<MenuItem key={n.pgCd} value={n.pgCd}>
										{n.pgCd} - {n.pgName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>Trading Type</InputLabel>
							<Select value={search.tradingType} onChange={handleOnChange('search', 'tradingType')}>
								{search.tTypes.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Trading Provider"
							value={search.tradingProvider}
							onChange={handleOnChange('search', 'tradingProvider')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl className={classes.input}>
							<InputLabel>In Warranty</InputLabel>
							<Select value={search.inWarranty} onChange={handleOnChange('search', 'inWarranty')}>
								{search.inWarrantyTypes.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Specification"
							multiline
							rows="4"
							value={search.spec}
							onChange={handleOnChange('search', 'spec')}
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

ProductSearchForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductSearchForm);
