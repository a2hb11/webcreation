import { Hero } from '@/components/home/hero'
import { CategoryMarquee } from '@/components/home/marquee'
import { ServicesBento } from '@/components/home/services-bento'
import { Showcase } from '@/components/home/showcase'
import { Steps } from '@/components/home/steps'
import { Packages } from '@/components/home/packages'
import { FactorsTeaser } from '@/components/home/factors-teaser'
import { Faq } from '@/components/home/faq'
import { CtaBand } from '@/components/home/cta-band'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryMarquee />
      <ServicesBento />
      <Showcase />
      <Steps />
      <Packages />
      <FactorsTeaser />
      <Faq />
      <CtaBand />
    </>
  )
}
