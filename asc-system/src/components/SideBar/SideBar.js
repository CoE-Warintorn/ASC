import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { SwipeableDrawer, List, ListItem, ListItemText, ListItemIcon, Divider, Button } from '@material-ui/core';
import { Inbox as InboxIcon } from '@material-ui/icons';
import routes from '../../routes';
import { NavLink } from 'react-router-dom';

const styles = theme => ({
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		flexGrow: 1,
		[theme.breakpoints.up('md')]: {
			position: 'fixed'
		}
	},
	active: {
		backgroundColor: theme.palette.action.selected
	}
});

const SideBar = ({ ...props }) => {
	const { classes, rightButtons, handleDrawerToggle, signout, ...rest } = props;

	return (
		<SwipeableDrawer
			onOpen={() => handleDrawerToggle()}
			onClose={() => handleDrawerToggle()}
			style={{ width: 265 }}
			{...rest}
			classes={{
				paper: classes.drawerPaper
			}}
		>
			<div className={classes.toolbar} />
			{rightButtons}
			<List>
				{routes.map((r, key) => {
					if (r.menu)
						return (
							<ListItem key={r.name} button divider component={NavLink} to={r.path} activeClassName={classes.active}>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={r.name} />
							</ListItem>
						);
					else return '';
				})}
			</List>
			<Divider />
			<Button variant="contained" color="secondary" onClick={signout}>
				Sign Out
			</Button>
			<Divider />
			<div className={classes.toolbar} />
		</SwipeableDrawer>
	);
};

SideBar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SideBar);
