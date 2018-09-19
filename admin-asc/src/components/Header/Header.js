import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	AppBar,
	Toolbar,
	Hidden,
	IconButton,
	Typography,
	SwipeableDrawer,
	Divider
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	appBar: {
		flexGrow: 1
	},
	navIconHide: {
		color: 'inherit',
		marginLeft: -10,
		marginRight: 15
	},
	pageName: {
		flex: 1,
		color: 'inherit',
		marginLeft: 20
	},
	rightButtons: {
		display: 'flex',
		flexDirection: 'row',
		padding: 0
	}
});

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileOpen: false
		};
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	render() {
		const { classes, pageTitle, rightButtons = '' } = this.props;

		return (
			<AppBar className={classes.appBar}>
				<Toolbar>
					{rightButtons && (
						<Hidden mdUp>
							<IconButton
								onClick={this.handleDrawerToggle}
								className={classes.navIconHide}
							>
								<MenuIcon />
							</IconButton>
							<SwipeableDrawer
								variant="temporary"
								anchor="left"
								open={this.state.mobileOpen}
								onClose={this.handleDrawerToggle}
								onOpen={this.handleDrawerToggle}
							>
								<div className={classes.toolbar} />
								<Divider />
								{rightButtons}
								<Divider />
							</SwipeableDrawer>
						</Hidden>
					)}
					<Typography
						variant="headline"
						className={classes.pageName}
						noWrap
					>
						{pageTitle}
					</Typography>
					<Hidden mdDown>{rightButtons}</Hidden>
				</Toolbar>
			</AppBar>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
