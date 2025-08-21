import React from "react";
import Input from "./Input";

interface CodeInputProps {
    value: string;
    onChange: (value: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChange }) => (
    <Input
        label="Verification Code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter code"
    />
);

export default CodeInput;
