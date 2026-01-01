import '../styles/button.css';

export default function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}