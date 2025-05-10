import Interviews from '@/components/Interviews';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Home = () => {

  return (
    <div className="container mx-auto px-4 ">

      <section className="hero min-h-[80vh] flex items-center justify-center text-center py-20 md:py-32">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 tracking-tigh animate-fadeIn ">
            Crafting Your Ideal<br className="hidden sm:inline"/><span className=''>Interview Experience</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fadeIn animation-delay-200">
            Leveraging deep understanding to generate precise, tailored interview questions and scenarios for your needs.
          </p>

          <div className="mt-8 animate-fadeIn animation-delay-400">
            <Link href="/generate-interview" passHref>
              <Button size="lg" className="text-lg px-8 py-6">
                Start Crafting Your Interview
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="interviews" className="interviews py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Your Interviews
        </h2>
        <Interviews></Interviews>
      </section>

    </div>
  )
}

export default Home;