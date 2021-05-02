import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from '../Page/App';

const Routing: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
};

export default Routing;
