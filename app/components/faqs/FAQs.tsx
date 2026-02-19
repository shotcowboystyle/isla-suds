import {FAQS} from '~/content/faqs';
import styles from './FAQs.module.css';

export function FAQs() {
  const orders = FAQS.filter((faq) => faq.category === 'orders');
  const products = FAQS.filter((faq) => faq.category === 'products');

  return (
    <div className={styles['faq-section']}>
      <div className={styles['heading-wrapper']}>
        <h1>Frequently Asked</h1>
        <div className={styles['clipped-box-wrapper']}>
          <h1 className={styles['clipped-box-content']}>questions</h1>
        </div>
      </div>

      <div>
        <div
          data-current="Tab 1"
          data-easing="ease"
          data-duration-in="300"
          data-duration-out="100"
          className={styles['faq-tabs']}
        >
          <div className={styles['tabs-menu']} role="tablist">
            <a
              data-w-tab="Tab 1"
              className={`${styles['tab-link']} w--current`}
              id="tab-0"
              href="#tab-0"
              role="tab"
              aria-controls="tab-0"
              aria-selected="true"
            >
              <div>orders</div>
            </a>

            <a
              data-w-tab="Tab 2"
              className={styles['tab-link']}
              id="tab-1"
              href="#tab-1"
              role="tab"
              aria-controls="tab-1"
              aria-selected="false"
              tabIndex={-1}
            >
              <div>Product questions</div>
            </a>
          </div>

          <div className={styles['tab-content']}>
            <div
              data-w-tab="Tab 1"
              className={`${styles['tab-pane']} active`}
              id="pane-0"
              role="tabpanel"
              aria-labelledby="tab-0"
            >
              <div className={styles['tab-content-grid']}>
                {orders.map((faq) => (
                  <div key={faq.id} className={styles['faq-item']}>
                    <div className={styles['faq-answer']}>{faq.answer}</div>
                    <div className={styles['faq-question']}>{faq.question}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-w-tab="Tab 2" className={styles['tab-pane']} id="pane-1" role="tabpanel" aria-labelledby="tab-1">
              <div className={styles['tab-content-grid']}>
                {products.map((faq) => (
                  <div key={faq.id} className={styles['faq-item']}>
                    <div className={styles['faq-answer']}>{faq.answer}</div>
                    <div className={styles['faq-question']}>{faq.question}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
