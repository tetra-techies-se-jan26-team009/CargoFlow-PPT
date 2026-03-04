export default function AppLayout({ children, fullWidth = false }) {
  if (fullWidth) {
    return <>{children}</>;
  }
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {children}
    </div>
  );
}