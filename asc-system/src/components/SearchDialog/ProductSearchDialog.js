import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Divider
} from '@material-ui/core';

const styles = theme => ({
	root: {
		padding: '2%'
	},
	icon: {
		marginRight: theme.spacing.unit * -2
	},
	input: {
		width: '80%'
	}
});

const ProductSearchDialog = ({ ...props }) => {
	const {
		classes,
		product,
		handleOnChange,
		handleProductDialogOnSelect,
		handleProductDialogOnSearch,
		handleOnToggle
	} = props;

	return (
		<Dialog open={product.open} onClose={handleOnToggle('product', 'open')}>
			<DialogTitle>Search Product Code</DialogTitle>
			<DialogContent style={{ overflowY: 'visible' }}>
				<Grid container spacing={16}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Product Code"
							value={product.pdCd}
							onChange={handleOnChange('product', 'pdCd')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Product Name"
							value={product.pdName}
							onChange={handleOnChange('product', 'pdName')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className={classes.input}>
							<InputLabel>Product Group</InputLabel>
							<Select value={product.pgCd} onChange={handleOnChange('product', 'pgCd')}>
								<MenuItem value="all"> All </MenuItem>
								{product.pgList.map(n => (
									<MenuItem key={n.pgCd} value={n.pgCd}>
										{n.pgCd} - {n.pgName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className={classes.input}>
							<InputLabel>Trading Type</InputLabel>
							<Select
								value={product.tradingType}
								onChange={handleOnChange('product', 'tradingType')}
							>
								{product.tTypes.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Trading Provider"
							value={product.tradingProvider}
							onChange={handleOnChange('product', 'tradingProvider')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className={classes.input}>
							<InputLabel>In Warranty</InputLabel>
							<Select value={product.inWarranty} onChange={handleOnChange('product', 'inWarranty')}>
								{product.inWarrantyTypes.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Specification"
							multiline
							rows="4"
							value={product.spec}
							onChange={handleOnChange('product', 'spec')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Detail"
							multiline
							rows="4"
							value={product.detail}
							onChange={handleOnChange('product', 'detail')}
							className={classes.input}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={handleProductDialogOnSearch}>
					search
				</Button>
			</DialogActions>
			<Divider />
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Product Code</TableCell>
						<TableCell>Product Name</TableCell>
						<TableCell>Product Group</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{product.pdList.map(pd => (
						<TableRow key={pd.pdCd} hover onClick={handleProductDialogOnSelect(pd.pdCd)}>
							<TableCell>{pd.pdCd}</TableCell>
							<TableCell>{pd.pdName}</TableCell>
							<TableCell>{pd.pgName}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Dialog>
	);
};

ProductSearchDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductSearchDialog);
