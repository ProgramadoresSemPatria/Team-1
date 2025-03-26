import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqAccordion({
  title,
  content,
}: { title: string; content: string }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="border rounded-md px-4 mx-4 md:px-8 md:mx-8"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h3 className="text-lg font-bold text-gray-800 md:text-2xl">
            {title}
          </h3>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-500 md:text-lg">{content}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
