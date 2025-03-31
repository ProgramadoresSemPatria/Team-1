import { FaqAccordion } from './FaqAccordion';

export function FaqSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold md:text-5xl">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-500 md:text-2xl">
        Have questions? We're here to help.
      </p>
      <div className="flex flex-col gap-4 items-center">
      <FaqAccordion
        title="How does FeedAI work?"
        content="FeedAI uses advanced natural language processing and machine learning algorithms to analyze customer reviews and feedback. You can either upload your data via CSV or use our web scraping feature to collect reviews from popular platforms. Our AI then processes this data to identify sentiment, trends, common issues, and actionable insights."
      />
      <FaqAccordion
        title="Is my data safe with FeedAI?"
        content="Absolutely. We take data security very seriously. All your data is encrypted both in transit and at rest. We follow industry best practices for data protection and comply with relevant data privacy regulations. We never share your data with third parties without your explicit permission."
      />
      <FaqAccordion
        title="How does the web scraping feature work?"
        content="Our web scraping feature allows you to specify websites or platforms where your customers leave reviews. FeedAI will automatically collect these reviews, ensuring you have the most up-to-date feedback. The system can be configured to scrape data at regular intervals, providing you with real-time insights into customer sentiment."
      />
      <FaqAccordion
        title="Can I export the insights and reports?"
        content="Yes, all insights and reports can be exported in various formats including PDF, CSV, and Excel. This makes it easy to share findings with your team or incorporate the data into your existing workflows and reporting systems."
      />
      <FaqAccordion
        title="How does payment work?"
        content="We use Stripe to process payments, ensuring a secure and seamless transaction experience. You can pay via credit card or bank transfer. For annual subscriptions, you'll be billed once for the entire year, while monthly subscriptions are billed at the beginning of each month."
      />
      </div>
    </div>
  );
}
