import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import appRoutes from './routes';
import { SignInPage } from './views';
import { authenticate } from './api';

const auth = {
	token: '',
	usn: '',
	isAuthenticated: false,
	signin: (username, password, callback) => {
		authenticate(username, password, (err, token) => {
			if (token) {
				auth.token = token;
				auth.usn = username;
				auth.isAuthenticated = true;
				callback(false, true);
			} else {
				callback(err, false);
			}
		});
	},
	signout: callback => {
		auth.token = '';
		auth.usn = '';
		auth.isAuthenticated = false;
		callback();
	}
};

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			auth.isAuthenticated ? (
				<Component
					{...props}
					auth={{ token: auth.token, usn: auth.usn }}
					signout={() =>
						auth.signout(() => {
							props.history.push('/signin');
						})
					}
				/>
			) : (
				<Redirect
					to={{
						pathname: '/signin',
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Router>
				<Switch>
					{appRoutes.map((r, key) => {
						// return <Route key={key} exact path={r.path} component={r.component} />;
						return <PrivateRoute key={key} exact path={r.path} component={r.component} />;
					})}
					<Route exact path="/signin" render={props => <SignInPage {...props} signin={auth.signin} />} />
					<Redirect
						to={{
							pathname: '/admin/usermanagement',
							state: { from: this.props.location }
						}}
					/>
				</Switch>
			</Router>
		);
	}
}

export default App;
