import FeedAI_Logo from '@/assets/FeedAI_Logo.png';

export function WelcomeMessageSignUp() {
  return (
    <>
      <img src={FeedAI_Logo} alt="FeedAI logo" className="h-40 w-40" />
      <h1 className="mt-10 text-5xl whitespace-nowrap">
        Hello, <span className="text-sky-400">Welcome!</span>
      </h1>
      <p className="my-5 text-xl">Create your account right now!</p>
    </>
  );
}
