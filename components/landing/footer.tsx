export const Footer: React.FC = () => (
  <footer className="mt-auto border-t bg-nav-footer">
    <div className="py-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.
    </div>
  </footer>
);
