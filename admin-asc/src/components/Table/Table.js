import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Checkbox, Button, Table, TableHead, TableBody, TableRow, TableCell, Tooltip, Typography } from '@material-ui/core';

import {
	Settings as EditIcon,
	Save as SaveIcon,
	Block as CancelIcon,
	Check as YesIcon,
	Close as NoIcon
} from '@material-ui/icons';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const styles = theme => ({});

const row = ({ ...props }) => {
	const { user, editObj, handleOpenEdit, handleOnChangeEdit, handleOnSaveEdit, handleOnCloseEdit } = props;
	const currentlyEditing = user.username === editObj.username;
	return (
		<TableRow key={user.username}>
			<TableCell>{user.username}</TableCell>
			<TableCell>
				<Checkbox
					disabled={!currentlyEditing}
					checked={!currentlyEditing ? user.adminInd === 'y' : editObj.adminInd === 'y'}
					onChange={handleOnChangeEdit('adminInd', editObj.adminInd === 'y' ? 'n' : 'y')}
				/>
			</TableCell>
			<TableCell>{moment(user.startDate).format('DD-MM-YYYY')}</TableCell>
			<TableCell>
				{!currentlyEditing ? (
					moment(user.endDate).format('DD-MM-YYYY')
				) : (
					<div>
						<DatePicker
							placeholderText="DD-MM-YYYY"
							dateFormat="DD-MM-YYYY"
							disabled={!currentlyEditing}
							selected={moment(editObj.endDate)}
							onChange={handleOnChangeEdit('endDate')}
						/>
						<Typography variant="caption" gutterBottom>
							Year - Month - Day
						</Typography>
					</div>
				)}
			</TableCell>
			<TableCell>{new Date() <= new Date(user.endDate) ? <YesIcon /> : <NoIcon />}</TableCell>
			<TableCell>
				{editObj.length === 0 ? (
					<Tooltip title="Edit" placement="top">
						<Button variant="fab" mini onClick={() => handleOpenEdit(user.username)}>
							<EditIcon />
						</Button>
					</Tooltip>
				) : currentlyEditing ? (
					<div>
						<Tooltip title="Save" placement="top">
							<Button variant="fab" mini onClick={handleOnSaveEdit}>
								<SaveIcon />
							</Button>
						</Tooltip>
						<Tooltip title="Cancel" placement="top">
							<Button variant="fab" mini onClick={handleOnCloseEdit}>
								<CancelIcon />
							</Button>
						</Tooltip>
					</div>
				) : (
					''
				)}
			</TableCell>
		</TableRow>
	);
};

const CustomTable = ({ ...props }) => {
	const { tableHead, tableData, ...rest } = props;
	return (
		<Table>
			<TableHead>
				<TableRow>{tableHead.map((head, key) => <TableCell key={key}>{head}</TableCell>)}</TableRow>
			</TableHead>
			<TableBody>{tableData.map(user => row({ user, ...rest }))}</TableBody>
		</Table>
	);
};

CustomTable.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(CustomTable);
