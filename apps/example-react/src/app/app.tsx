import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { ReactPayfastExample } from './react-payfast-example';
const withRouter = (Component: React.FC) => (props: RouteComponentProps) =>
  <Component />;

const Home = withRouter(ReactPayfastExample);
const Success = withRouter(() => <div id="success">Success</div>);
const Cancel = withRouter(() => <div id="cancel">Cancel</div>);

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
