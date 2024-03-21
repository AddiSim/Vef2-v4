const Input = ({ value, onChange, placeholder, type = "text" }: { value: any, onChange: any, placeholder: any, type?: string }) => (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
    
    export default Input;
