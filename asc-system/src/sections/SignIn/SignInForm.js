import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Divider,
	TextField,
	Grid,
	Typography
} from '@material-ui/core';
import { Done as DoneIcon, AccountCircle as AccountIcon, LockOutline as LockIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	sheet: {
		padding: '5%'
	},
	signin: {
		maxWidth: 350
	}
});

class SignInForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: {
				value: '',
				error: false,
				helperText: ''
			},
			password: {
				value: '',
				error: false,
				helperText: ''
			},
			redirectToReferrer: false,
			errorMessage: ''
		};
	}

	handleOnChange = prop => e => {
		const { value } = e.target;
		this.setState({
			...this.state,
			[prop]: { value: value.toLowerCase() }
		});
	};

	handleOnEnter = e => {
		if (e.keyCode === 13) this.signin();
	};

	handleOnClick = e => {
		e.preventDefault();
		this.signin();
	};

	signin = () => {
		let username = this.state.username.value;
		let password = this.state.password.value;

		if (username === '') {
			this.setState({
				...this.state,
				username: {
					...this.state.username,
					error: true,
					helperText: 'Please fill username'
				}
			});
			this.usernameInput.focus();
		} else if (username !== '' && password === '') {
			this.setState({
				...this.state,
				username: {
					...this.state.username,
					error: false,
					helperText: ''
				},
				password: {
					...this.state.password,
					error: true,
					helperText: 'Please fill password'
				}
			});
			this.passwordInput.focus();
		} else {
			this.props.signin(username, password, (err, success) => {
				if (success) this.setState({ redirectToReferrer: true });
				else if (err === 'NoAuth')
					this.setState({
						...this.state,
						errorMessage: 'You are not authorized to use asset control system'
					});
				else if (err === 'Incorrect')
					this.setState({
						...this.state,
						errorMessage: 'Username or password is incorrect'
					});
				else
					this.setState({
						...this.state,
						errorMessage: 'Server error'
					});
			});
		}
	};

	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } };
		const { username, password, redirectToReferrer, errorMessage } = this.state;
		const { classes } = this.props;

		if (redirectToReferrer) return <Redirect to={from} />;

		return (
			<div>
				<Grid container className={classes.root} onKeyDown={this.handleOnEnter}>
					<Grid item xs={12}>
						<Grid container className={classes.sheet} spacing={8} alignItems="center" justify="center">
							<Grid item className={classes.signin}>
								<Card raised>
									<CardHeader title="Sign In" />
									<Divider />
									<CardContent>
										<TextField
											margin="dense"
											label="Username"
											value={this.state.username.value}
											error={username.error}
											helperText={username.helperText}
											inputRef={input => (this.usernameInput = input)}
											onChange={this.handleOnChange('username')}
											fullWidth
											autoFocus
											InputProps={{
												endAdornment: <AccountIcon />
											}}
										/>
										<TextField
											margin="dense"
											label="Password"
											value={this.state.password.value}
											error={password.error}
											helperText={password.helperText}
											inputRef={input => (this.passwordInput = input)}
											onChange={this.handleOnChange('password')}
											fullWidth
											type="password"
											InputProps={{
												endAdornment: <LockIcon />
											}}
										/>
										<br />
										<br />
										<Typography color="error"> {errorMessage} </Typography>
									</CardContent>
									<Divider />
									<CardActions>
										<Button fullWidth variant="outlined" onClick={this.handleOnClick}>
											<DoneIcon />
										</Button>
									</CardActions>
								</Card>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}

SignInForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignInForm);
