import { AsideNav } from '@/components/AsideNav';
import { Header } from '../Header';
import { Outlet } from 'react-router-dom';

const FixedLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col flex-1 overflow-hidden md:pl-20 md:flex-row">
        <AsideNav />
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FixedLayout;
