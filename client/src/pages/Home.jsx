import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import PhoneShowcase from '../components/PhoneShowcase';
import Strategy from '../components/Strategy';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Milestones from '../components/Milestones';
import Blogs from '../components/Blogs';
import Faq from '../components/Faq';

export default function Home({ data: d }) {
  return (
    <main>
      <Hero site={d.site} />
      <Marquee
        items={[
          'SEO & SMO',
          'Performance Marketing',
          'E-Commerce',
          'App Development',
          'Shopify',
          'Web Design',
          'Branding'
        ]}
      />
      <PhoneShowcase />
      <Strategy steps={d.strategy} />
      <Testimonials testimonials={d.testimonials} />
      <About site={d.site} />
      <Milestones milestones={d.milestones} />
      <Blogs blogs={d.blogs} />
      <Faq faqs={d.faqs} />
    </main>
  );
}
