import { ReactPayfastProps, usePayfast } from './use-payfast'

export const ReactPayfast = ({
  sandbox,
  children,
  ...props
}: ReactPayfastProps) => {
  const { fields } = usePayfast(props);
  const actionUrl = sandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';
  return (
    <form name="react-payfast" action={actionUrl} method="post">
      {fields.map((field) => (
        <input
          {...field}
          key={field.name}
          role="none"
          data-testid={field.name}
        />
      ))}
      {children}
    </form>
  );
};

export default ReactPayfast;
