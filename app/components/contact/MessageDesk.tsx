import {useRef, useState, type CSSProperties} from 'react';
import {Link} from 'react-router';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import GoatSlip from '~/assets/images/contact/goat-slip.webp';
import Wall from '~/assets/images/contact/wall.webp';
import {CONTACT_PAGE} from '~/content/contact';
import {MOTION_QUERY, REDUCED_MOTION_QUERY, REVEAL_START} from '~/lib/motion/tokens';
import styles from './MessageDesk.module.css';
import {MessageSlip} from './MessageSlip';
import type {ContactActionData} from '~/routes/contact';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {desk, taken} = CONTACT_PAGE;

/** Each pinned note hangs at its own angle. */
const NOTE_TILTS = [-3, 2.5, -1.5, 3];

/**
 * Act 2: the desk. Notes pinned up beside the pad say what to expect; the pad
 * is the form. On a successful send the slip tears off, flies to the goat,
 * and the goat pops up holding it with the sender's name on it.
 */
export function MessageDesk({actionData}: {actionData?: ContactActionData}) {
  const deskRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const takenRef = useRef<HTMLHeadingElement>(null);
  // "Leave another message" dismisses this result and puts a fresh slip on the pad.
  const [dismissed, setDismissed] = useState<ContactActionData | undefined>();
  const [slipKey, setSlipKey] = useState(0);
  const success = Boolean(actionData?.success) && actionData !== dismissed;

  // The notes swing in on their pins.
  useGSAP(
    () => {
      const mm = GSAP.matchMedia();
      mm.add(MOTION_QUERY, () => {
        GSAP.fromTo(
          '[data-note]',
          {rotation: -22, y: -18, opacity: 0},
          {
            rotation: 0,
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'elastic.out(1, 0.45)',
            stagger: 0.14,
            scrollTrigger: {trigger: '[data-notes]', start: REVEAL_START, toggleActions: 'play none none reverse'},
          },
        );
      });
      return () => mm.revert();
    },
    {scope: deskRef},
  );

  // The peak: tear, flight, the goat takes it.
  useGSAP(
    () => {
      // A sent slip can't be focused or typed into while it flies off.
      if (slotRef.current) slotRef.current.inert = success;
      const sheet = sheetRef.current;
      const target = deskRef.current?.querySelector('[data-taken-slip]');
      if (!success || !sheet || !target) return;

      takenRef.current?.focus({preventScroll: true});
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Measured with the goat in its landed spot (the CSS default), before it hides.
        const from = sheet.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);

        GSAP.timeline()
          .set('[data-taken-goat]', {yPercent: 105})
          .set('[data-taken-card]', {opacity: 0, scale: 0.9, rotation: -3})
          .set(['[data-taken-slip]', '[data-taken-copy] > *'], {opacity: 0})
          .to(sheet, {keyframes: {rotation: [0, -1.6, 1.6, 0]}, duration: 0.35, ease: 'none'})
          .add(() => sheet.classList.add(styles.torn))
          .to(sheet, {y: -16, rotation: -4, duration: 0.16, ease: 'power2.out'})
          .to('[data-pad-rest]', {opacity: 0, y: 24, duration: 0.4}, '<')
          .to('[data-taken-card]', {opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.8)'}, '<')
          .to(sheet, {x: dx, y: dy, scale: to.width / from.width, rotation: -0.7, duration: 0.85, ease: 'power3.inOut'})
          .to('[data-taken-goat]', {yPercent: 0, duration: 0.7, ease: 'back.out(1.6)'}, '-=0.5')
          .to(sheet, {autoAlpha: 0, duration: 0.18}, '-=0.2')
          .to('[data-taken-slip]', {opacity: 1, duration: 0.18}, '<')
          .fromTo(
            '[data-taken-copy] > *',
            {opacity: 0, y: 14, scale: 0.92},
            {opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.12},
          );
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set([sheet, '[data-pad-rest]'], {autoAlpha: 0});
      });

      return () => mm.revert();
    },
    {dependencies: [success], scope: deskRef, revertOnUpdate: true},
  );

  // Most visitors never send; fetch the goat's photo once they start writing.
  const preloadGoat = useRef(false);
  const warmGoat = () => {
    if (preloadGoat.current) return;
    preloadGoat.current = true;
    new Image().src = GoatSlip;
  };

  const leaveAnother = () => {
    setDismissed(actionData);
    setSlipKey((n) => n + 1);
  };

  return (
    <section ref={deskRef} className={styles.desk} aria-labelledby="desk-heading">
      <div className={styles.inner}>
        <div className={styles.side}>
          <h2 id="desk-heading" className={styles['heading-tilt']}>
            <span className={styles.heading}>{desk.heading}</span>
          </h2>

          <ul data-notes className={styles.notes}>
            {desk.notes.map((note, i) => (
              <li
                key={note.title}
                className={styles['note-tilt']}
                style={{'--tilt': `${NOTE_TILTS[i]}deg`} as CSSProperties}
              >
                <div data-note className={styles.note}>
                  <span className={styles.pin} aria-hidden="true" />
                  <p className={styles['note-title']}>{note.title}</p>
                  {'body' in note && <p className={styles['note-body']}>{note.body}</p>}
                  {'link' in note &&
                    note.link &&
                    (note.link.href.startsWith('/') ? (
                      <Link to={note.link.href} prefetch="intent" className={styles['note-link']}>
                        {note.link.label}
                      </Link>
                    ) : (
                      <a href={note.link.href} className={styles['note-link']}>
                        {note.link.label}
                      </a>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.stage}>
          <div ref={slotRef} className={styles['slip-slot']} onFocusCapture={warmGoat}>
            <MessageSlip key={slipKey} actionData={success ? undefined : actionData} sheetRef={sheetRef} />
            <p data-pad-rest className={styles['aside-tilt']} aria-hidden="true">
              <span className={styles.aside}>{desk.aside}</span>
            </p>
          </div>

          {success && (
            <div className={styles.taken}>
              <div data-taken-card className={styles.card}>
                <img
                  src={Wall}
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className={styles['card-wall']}
                />
                <div data-taken-goat className={styles['card-goat']}>
                  <img
                    src={GoatSlip}
                    alt="The goat, grinning, holding up your message slip."
                    width={1000}
                    height={1143}
                    decoding="async"
                  />
                  {/* Written over the photo, never baked into it. */}
                  <p data-taken-slip className={styles['card-slip']} aria-hidden="true">
                    <span>{taken.slipFor}</span>
                    <span>{taken.slipFrom(actionData?.name ?? '')}</span>
                  </p>
                </div>
              </div>
              <div data-taken-copy className={styles['taken-copy']}>
                <h3 ref={takenRef} tabIndex={-1} className={styles['taken-tilt']}>
                  <span className={styles['taken-sticker']}>{taken.sticker}</span>
                </h3>
                <p className={styles['taken-body']}>
                  <strong>{taken.thanks(actionData?.name ?? '')}</strong> {taken.body}
                </p>
                <button type="button" onClick={leaveAnother} className={styles.again}>
                  {taken.again}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
