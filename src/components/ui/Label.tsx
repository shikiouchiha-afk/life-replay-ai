import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, required = false, ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium text-slate-300 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )
);

Label.displayName = 'Label';
