import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Hidden, IconButton, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import SideBar from '../SideBar/SideBar';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	appBar: {
		flexGrow: 1,
		zIndex: theme.zIndex.drawer + 1
	},
	navIconHide: {
		color: 'inherit',
		marginLeft: 10,
		marginRight: -15,
		[theme.breakpoints.up('lg')]: {
			display: 'none'
		}
	},
	pageName: {
		flexGrow: 1,
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
		const { classes, pageTitle, rightButtons = '', signout } = this.props;
		console.log(this.props);
		return (
			<div>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="display1" className={classes.pageName} noWrap>
							{pageTitle}
						</Typography>
						<Hidden mdDown>{rightButtons}</Hidden>
						<IconButton onClick={this.handleDrawerToggle} className={classes.navIconHide}>
							<MenuIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Hidden lgUp>
					<SideBar
						rightButtons={rightButtons}
						variant="temporary"
						anchor="left"
						open={this.state.mobileOpen}
						handleDrawerToggle={this.handleDrawerToggle}
						// Better open performance on mobile.
						ModalProps={{ keepMounted: true }}
						signout={signout}
					/>
				</Hidden>
				<Hidden mdDown>
					<SideBar variant="permanent" open signout={signout} />
				</Hidden>
			</div>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
