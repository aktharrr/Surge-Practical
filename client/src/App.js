import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './login/login';
import Register from './registration/register';
import Profile from './profile/profile';
import {ProtectedRoute} from './protectedRoute/protectedroute'

function App() {
  return (
    <Router>
      <Switch>

        <Route exact path='/' >
          <Login/>
        </Route>
        <Route path='/reg' >
          <Register/>
        </Route>
        <ProtectedRoute path='/profile' component={Profile}/>
        

      </Switch>
    </Router>
  );
}

export default App;
