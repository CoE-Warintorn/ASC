import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { SignInForm } from '../sections';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	root: {
		display: 'flex'
	},
	RightIconButton: {
		color: 'inherit'
	},
	RightIcon: {
		marginRight: theme.spacing.unit
	}
});

const SignInPage = ({ ...props }) => {
	const { classes, ...rest } = props;

	return (
		<div>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<Typography variant="headline" color="inherit" noWrap>
						Asset Control System
					</Typography>
				</Toolbar>
			</AppBar>
			<div className={classes.toolbar} />
			<div>
				<SignInForm {...rest} />
			</div>
		</div>
	);
};

SignInPage.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(SignInPage);
