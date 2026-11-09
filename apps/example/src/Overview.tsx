import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  Skeleton,
  Spinner,
} from '@up201905892/ui';
import { faqs, indicators } from './data';

const LOADING_MS = 600;

export function Overview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="ds-example-section" aria-labelledby="overview-title">
      <h1 id="overview-title">Overview</h1>
      <Alert variant="info" title="Welcome">
        This is a demo app built only with the design system. All data is fictional.
      </Alert>
      <section
        className="ds-example-section"
        aria-labelledby="indicators-title"
        aria-busy={loading}
      >
        <h2 id="indicators-title">This week</h2>
        {loading ? (
          <div className="ds-example-loading">
            <Spinner label="Loading indicators" />
            <Skeleton variant="rect" height={96} />
          </div>
        ) : (
          <Grid minColumnWidth="14rem" gap={4}>
            {indicators.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle as="h3">{item.label}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="ds-example-value">{item.value}</p>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </section>
      <section className="ds-example-section" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        <Accordion type="single" collapsible headingLevel={3}>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </section>
  );
}
