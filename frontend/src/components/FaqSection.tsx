import { FaqAccordion } from './FaqAccordion';

export function FaqSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold text-gray-800 md:text-5xl">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-500 md:text-2xl">
        Here are some of the most common questions we get asked. If you have any
        other questions, please don't hesitate to contact us.
      </p>
      <FaqAccordion
        title="How does FeedAI work?"
        content="FeedAI uses AI to analyze customer reviews and feedback and give
          you the best insights about your brand."
      />
      <FaqAccordion
        title="My data is safe with you?"
        content="Yes, your data is safe with us.We store your data in a secure way and we don't share it with anyone."
      />
      <FaqAccordion
        title="How payment works?"
        content="We use Stripe to process payments. It's a secure and easy way to pay for your subscription."
      />
    </div>
  );
}
