import { usePayfast } from './hooks/usePayfast';
import './react-payfast.module.scss';
import { ReactPayfastProps } from '@za-payments/payfast';

export const ReactPayfast: React.FC<ReactPayfastProps> = ({
  sandbox,
  children,
  ...props
}) => {
  const { fields, signature } = usePayfast(props);
  console.log(signature);
  const action_url = sandbox
    ? 'https://sandbox.payfast.co.za​/eng/process'
    : 'https://www.payfast.co.za/eng/process';
  return (
    <form name="react-payfast" action={action_url} method="post">
      {fields.map((field) => (
        <input
          {...field}
          key={field.name}
          role="none"
          data-testid={field.name}
        />
      ))}
      {children ? children : <input type="submit" />}
    </form>
  );
};

export default ReactPayfast;
