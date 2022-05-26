
import { RouteComponentProps, Router } from '@reach/router';
import type { FC } from 'react';
import { ReactPayfastExample } from './react-payfast';
const withRouter = (Component: FC) => (props: RouteComponentProps) =>
  <Component />;

const Home = withRouter(ReactPayfastExample);
const Success = withRouter(() => <div id="success">Success</div>);
const Cancel = withRouter(() => <div id="cancel">Cancel</div>);
import './app.css'
export function App() {
  return (
    <Router>
      <Home path="/" />
      <Success path="/success" />
      <Cancel path="/cancel" />
    </Router>
  );
}

export default App;