import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <div className="min-h-screen bg-background pb-16">
        {children}
        <BottomTabBar />
      </div>
    </LocaleProvider>
  );
}
