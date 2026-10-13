import { Route, Switch } from 'wouter';
import { ReactPayfastExample } from './react-payfast';
import './app.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={ReactPayfastExample} />
        <Route path="/success" component={() => <div id="success">Success</div>} />
        <Route path="/cancel" component={() => <div id="cancel">Cancel</div>} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;