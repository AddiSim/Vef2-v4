const Button = ({ onClick, children }: { onClick: any, children: any }) => (
    <button onClick={onClick}>{children}</button>
);
  
export default Button;
