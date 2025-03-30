import { Link } from 'react-router-dom';
import Logo from '@/assets/FeedAI_Logo.png';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import useAuthContext from '@/hooks/useAuth';

export function Header() {
  const { isLogged } = useAuthContext();

  return (
    <header className="py-6 flex justify-between items-center px-5 md:px-20 bg-white/80 backdrop-blur-md z-50 border-b">
      <Link to={isLogged ? '/upload' : '/'}>
        <div className="flex flex-row gap-4 items-center">
          <img src={Logo} alt="logo" className="w-20 h-20" />
          <span className="font-bold text-4xl">FeedAI</span>
        </div>
      </Link>
      {isLogged ? (
        <UserNav />
      ) : (
        <div className="flex gap-6">
          <Link to="/login">
            <Button
              variant="ghost"
              className="hidden md:inline-flex text-2xl py-8 px-6 hover:cursor-pointer"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-xl p-6 md:text-2xl md:py-8 md:px-6 hover:cursor-pointer">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
