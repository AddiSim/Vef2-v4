const Form = ({ children, onSubmit }: {children: any, onSubmit: any}) => (
    <form onSubmit={onSubmit}>{children}</form>
  );
  
  export default Form;