import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Popover, MenuList, MenuItem } from '@material-ui/core';

import _ from 'lodash';

const styles = theme => ({});

class SearchSelectField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPopover: false,
			anchorEl: null
		};
	}

	handleOnFocus = event => {
		this.setState({ openPopover: true, anchorEl: event.currentTarget });
	};

	handleOnBlur = event => {
		this.setState({ openPopover: false });
	};

	getFilteredSuggestions = () => {
		const { value, allList } = this.props;
		var regex = RegExp(value, 'i');
		var list = _.filter(allList, n => regex.test(`${n.key} ${n.name}`));
		if (list.length > 0) return list;
		else return [{ key: '', name: 'No Results' }];
	};

	render() {
		const { classes, label, value, handleOnChange, handleOnSelect } = this.props;
		const { openPopover, anchorEl } = this.state;
		return (
			<div>
				<TextField
					label={label}
					value={value}
					onChange={handleOnChange()}
					onFocus={this.handleOnFocus}
					onBlur={this.handleOnBlur}
					style={{ width: '80%' }}
				/>
				{value && (
					<Popover
						open={openPopover}
						anchorEl={anchorEl}
						anchorOrigin={{
							horizontal: 'left',
							vertical: 'bottom'
						}}
						anchorPosition={{ top: 0, left: 0 }}
						disableAutoFocus
						disableEnforceFocus
						disableRestoreFocus
						hideBackdrop
					>
						<MenuList>
							{this.getFilteredSuggestions().map((n, idx) => (
								<MenuItem key={idx} data-key={n.key} data-value={n.name} onClick={handleOnSelect} disabled={n.key === ''}>{`${n.key} - ${
									n.name
								}`}</MenuItem>
							))}
						</MenuList>
					</Popover>
				)}
			</div>
		);
	}
}

SearchSelectField.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchSelectField);
