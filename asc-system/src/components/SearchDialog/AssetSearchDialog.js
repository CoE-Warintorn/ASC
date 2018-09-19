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
	Divider,
	InputAdornment,
	IconButton
} from '@material-ui/core';

import { Search } from '@material-ui/icons';

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

const AssetSearchDialog = ({ ...props }) => {
	const { classes, asset, handleOnChange, handleOnToggle, handleAssetDialogOnSelect, handleAssetDialogOnSearch } = props;

	return (
		<Dialog open={asset.open} onClose={handleOnToggle('asset', 'open')}>
			<DialogTitle>Search Asset</DialogTitle>
			<DialogContent style={{ overflowY: 'visible' }}>
				<Grid container spacing={16}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Asset Code"
							value={asset.astCd}
							onChange={handleOnChange('asset', 'astCd')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className={classes.input}>
							<InputLabel>Product Group</InputLabel>
							<Select value={asset.pgCd} onChange={handleOnChange('asset', 'pgCd')}>
								<MenuItem value="all"> All </MenuItem>
								{asset.pgList.map(n => (
									<MenuItem key={n.pgCd} value={n.pgCd}>
										{n.pgCd} - {n.pgName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Product Code"
							value={asset.pdCd}
							onChange={handleOnChange('asset', 'pdCd')}
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
					<Grid item xs={12} sm={6}>
						<TextField
							label="Serial Number"
							value={asset.serialNumber}
							onChange={handleOnChange('asset', 'serialNumber')}
							className={classes.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className={classes.input}>
							<InputLabel>Status</InputLabel>
							<Select value={asset.status} onChange={handleOnChange('asset', 'status')}>
								{asset.statusList.map(n => (
									<MenuItem key={n.key} value={n.key}>
										{n.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Detail"
							multiline
							rows="4"
							value={asset.detail}
							onChange={handleOnChange('asset', 'detail')}
							className={classes.input}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={handleAssetDialogOnSearch}>
					search
				</Button>
			</DialogActions>
			<Divider />
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Asset Code</TableCell>
						<TableCell>Product Group</TableCell>
						<TableCell>Product Name</TableCell>
						<TableCell>Serial Number</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{asset.astList.map(ast => (
						<TableRow key={ast.astCd} hover onClick={handleAssetDialogOnSelect(ast.astCd)}>
							<TableCell>{ast.astCd}</TableCell>
							<TableCell>{ast.pgName}</TableCell>
							<TableCell>{ast.pdName}</TableCell>
							<TableCell>{ast.serialNumber}</TableCell>
							<TableCell>{ast.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Dialog>
	);
};

AssetSearchDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AssetSearchDialog);
