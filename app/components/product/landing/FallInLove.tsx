import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}
import {SimpleCard} from '~/components/ui/SimpleCard';
import {useIsDesktop} from '~/hooks/use-is-desktop';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './FallInLove.module.css';

interface FallInLoveProps {
  color: string;
}

export function FallInLove({color}: FallInLoveProps) {
  const SECTION_CONTENT = [
    {
      id: 1,
      number: '01',
      title: 'Gentle & soothing',
      description: <>Ideal for sensitive, reactive, or easily irritated skin</>,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.3"
            fill="currentColor"
            d="M20.5 3.5C20.5 3.5 18 2 13 4C8 6 3 13 3 16C3 19 5 21 8 21C11 21 18 16 20 11C22 6 20.5 3.5 20.5 3.5Z"
          />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4.5 19.5L10 14" />
        </svg>
      ),
    },
    {
      id: 2,
      number: '02',
      title: 'Moisturizing',
      description: <>Goat milk helps hydrate and soften skin naturally</>,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.3"
            fill="currentColor"
            d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 12 2 12 2C12 2 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z"
          />
          <path
            fill="currentColor"
            d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 12 9 12 9C12 9 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      number: '03',
      title: 'Fragrance-free',
      description: <>No added scent, dyes, or masking fragrances</>,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.3"
            fill="currentColor"
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          />
          <path fill="currentColor" d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" />
          <path fill="currentColor" d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5L5 16Z" />
        </svg>
      ),
    },
    {
      id: 4,
      number: '04',
      title: 'Everyday use',
      description: <>Suitable for face, hands, and body</>,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <path
            opacity="0.3"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            d="M12 2V4M12 20V22M4 12H2M22 12H20M4.92893 4.92893L6.34315 6.34315M17.6569 17.6569L19.0711 19.0711M4.92893 19.0711L6.34315 17.6569M17.6569 6.34315L19.0711 4.92893"
          />
        </svg>
      ),
    },
  ];

  const sectionCircle = useRef<HTMLDivElement>(null);
  const sectionArc = useRef<SVGSVGElement>(null);
  const circleContentWrapper = useRef<HTMLDivElement>(null);
  const innerCircle = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();
  const {isDesktop, isLoading: isLoadingDesktop} = useIsDesktop();

  useGSAP(
    () => {
      if (
        isMobile ||
        isLoading ||
        !sectionCircle.current ||
        !sectionArc.current ||
        !circleContentWrapper.current ||
        !innerCircle.current
      ) {
        return;
      }

      const windowWidth = window.innerWidth;

      gsap.to(sectionArc.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionCircle.current,
          // start: 'top bottom-=' + 0.06 * windowWidth,
          start: 'top bottom-=' + 0.06 * windowWidth,
          end: '+=500',
          scrub: !0,
        },
      });
    },
    {dependencies: [isMobile, isLoading, sectionCircle, sectionArc, circleContentWrapper, innerCircle]},
  );

  useGSAP(
    () => {
      if (!isDesktop || isLoadingDesktop || !sectionCircle.current || !innerCircle.current) {
        return;
      }

      const windowInnerWidth = window.innerWidth;

      const horizontalScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionCircle.current,
          start: 'top +=200',
          end: `+=${windowInnerWidth * 3}`,
          scrub: 1.5,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      horizontalScrollTl.to(innerCircle.current, {
        rotation: -130,
        ease: 'power1.inOut',
      });
    },
    {dependencies: [isLoadingDesktop, isDesktop, sectionCircle, innerCircle]},
  );

  return (
    <div className={styles['section-wrapper']}>
      <div className="lg-circle-section cir-top">
        <div className="lg-circle cir-top bg-secondary"></div>
      </div>
      <div ref={sectionCircle} className={styles['section-circle']}>
        {/* <svg
          ref={sectionArc}
          className={styles['arc']}
          width="1517"
          height="93"
          viewBox="0 0 1517 93"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 92.0674C528.5 -28.9327 977.5 -32.4328 1516.5 92.0674H0Z" className="fill-milk"></path>
        </svg> */}

        <div ref={innerCircle} className={styles['inner-circle']}>
          <div className={styles['circle']}>
            <div
              ref={circleContentWrapper}
              className={cn(styles['circle-content-wrapper'], styles['is-title'], 'text-center')}
            >
              <div>
                <h2>
                  Why you&apos;ll love
                  <br />
                  to use our soap
                </h2>
              </div>
            </div>
          </div>

          {SECTION_CONTENT.map((item) => (
            <div className={cn(styles['circle'], 'circle-item')} key={item.id}>
              <div className={styles['circle-content-wrapper']}>
                <SimpleCard {...item} className={styles['circle-content-card']} />
              </div>
            </div>
          ))}

          <div className={cn(styles['circle'], 'circle-item')}>
            <div className={styles['circle-content-wrapper']}>
              <div className="relative">
                <svg
                  className="overflow-visible h-auto w-[95vw]"
                  width="1397"
                  height="256"
                  viewBox="0 0 1397 256"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-black"
                    d="M95.2243 246.195C83.4358 250.731 71.9077 252.019 60.6398 250.057C49.326 247.98 39.2259 243.023 30.3397 235.187C21.4074 227.234 14.4781 217.037 9.55183 204.596C4.62552 192.154 2.73811 180.083 3.88958 168.384C5.04105 156.685 9.08682 146.352 16.0269 137.383C22.9209 128.298 32.2621 121.487 44.0506 116.95C55.8391 112.414 67.3902 111.184 78.7041 113.262C90.0887 115.179 100.224 120.055 109.11 127.891C117.997 135.727 124.903 145.866 129.829 158.308C134.755 170.75 136.666 182.878 135.56 194.693C134.409 206.392 130.328 216.807 123.317 225.937C116.377 234.905 107.013 241.658 95.2243 246.195ZM90.8044 235.032C100.842 231.169 108.442 225.564 113.603 218.218C118.719 210.756 121.497 202.316 121.938 192.901C122.334 183.369 120.529 173.545 116.523 163.428C112.564 153.428 107.187 145.113 100.392 138.482C93.5505 131.735 85.7077 127.383 76.863 125.427C67.9724 123.355 58.5082 124.25 48.4705 128.113C38.5495 131.931 30.9729 137.594 25.7408 145.101C20.5794 152.448 17.801 160.887 17.4055 170.419C17.0808 179.789 18.8981 189.475 22.8576 199.475C26.8631 209.591 32.228 218.045 38.9524 224.837C45.7474 231.468 53.5902 235.82 62.4809 237.892C71.4423 239.803 80.8835 238.85 90.8044 235.032Z"
                    data-svg-origin="69.71322059631348 181.6141586303711"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M170.156 216.334L130.994 88.0488L147 83.3L250.176 172.635L250.535 172.528L216.96 62.5441L229.909 58.7024L269.071 186.987L253.065 191.736L150.179 102.707L149.819 102.813L183.285 212.439L170.156 216.334Z"
                    data-svg-origin="200.03250885009766 137.51820373535156"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M258.209 51.9023L271.567 48.8869L299.201 167.843L369.652 151.939L372.369 163.634L288.56 182.553L258.209 51.9023Z"
                    data-svg-origin="315.28900146484375 115.7199478149414"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M345.723 32.4551L360.357 30.1201L411.716 90.5029L412.087 90.4438L441.497 17.1745L456.132 14.8395L420.425 100.701L429.332 154.94L415.809 157.097L406.902 102.859L345.723 32.4551Z"
                    data-svg-origin="400.927490234375 85.96826171875"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M575.496 138.952L567.575 17.0855L522.08 19.9553L521.302 7.97461L625.958 1.37299L626.737 13.3537L581.242 16.2234L589.163 138.09L575.496 138.952Z"
                    data-svg-origin="574.0195007324219 70.1624950170517"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M648.901 0.886719L662.595 0.986488L662.167 58.9513L737.953 59.5034L738.381 1.53864L752.074 1.63841L751.085 135.764L737.391 135.664L737.864 71.509L662.079 70.9569L661.605 135.112L647.911 135.012L648.901 0.886719Z"
                    data-svg-origin="699.9924926757812 68.32536339759827"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M792.263 62.2829L862.776 67.7185L861.829 79.687L791.315 74.2514L787.214 126.053L868.202 132.296L867.254 144.264L772.613 136.969L783.199 3.25781L875.596 10.3804L874.648 22.3489L795.905 16.2789L792.263 62.2829Z"
                    data-svg-origin="824.1044921875 73.7609076499939"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M1041.89 69.935C1040.57 77.3217 1037.6 82.9605 1032.96 86.8515C1028.47 90.6408 1022.83 93.0864 1016.02 94.1884L1015.96 94.5577C1023.48 97.2616 1029.14 101.863 1032.93 108.362C1036.84 114.882 1037.99 122.697 1036.36 131.807C1034.18 143.995 1028.57 152.666 1019.51 157.82C1010.59 162.995 999.407 164.415 985.977 162.08L929.791 152.31L953.391 20.2734L1006.06 29.4323C1019 31.6818 1028.64 36.4039 1034.98 43.5987C1041.44 50.8149 1043.74 59.5937 1041.89 69.935ZM998.519 86.5749C1007.14 88.0746 1013.84 87.2081 1018.61 83.9755C1023.38 80.743 1026.38 75.6796 1027.62 68.7854C1028.87 61.768 1027.7 55.8531 1024.12 51.0406C1020.65 46.2495 1014.8 43.1362 1006.54 41.7008L964.77 34.4381L956.75 79.3121L998.519 86.5749ZM954.637 91.1308L945.395 142.837L988.459 150.325C998.562 152.082 1006.36 151.09 1011.86 147.349C1017.35 143.608 1020.84 137.613 1022.31 129.365C1023.7 121.609 1022.47 114.985 1018.62 109.492C1014.78 104 1008.91 100.568 1001.03 99.1969L954.637 91.1308Z"
                    data-svg-origin="986.1497192382812 91.72120666503906"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M1076.46 102.735L1145.16 119.545L1142.23 131.188L1073.53 114.379L1060.85 164.772L1139.75 184.078L1136.83 195.721L1044.62 173.16L1077.35 43.084L1167.36 65.1104L1164.43 76.7536L1087.72 57.9821L1076.46 102.735Z"
                    data-svg-origin="1105.989990234375 119.40249633789062"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M1224.26 142.535C1234.85 148.782 1242.82 154.196 1248.16 158.779C1253.55 163.242 1257.21 168.538 1259.16 174.666C1261.11 180.795 1260.66 188.198 1257.83 196.878C1255.74 203.298 1252.13 208.713 1247.01 213.123C1241.89 217.534 1235.4 220.266 1227.56 221.32C1219.72 222.375 1210.85 221.332 1200.96 218.193C1191.06 215.054 1182.67 210.553 1175.77 204.69C1168.9 198.708 1164.11 191.612 1161.4 183.404C1158.84 175.114 1158.82 166.118 1161.32 156.418L1174.91 160.729C1172.49 171.376 1173.59 180.711 1178.21 188.736C1182.98 196.68 1191.81 202.694 1204.68 206.779C1212.07 209.124 1218.44 209.964 1223.79 209.299C1229.29 208.553 1233.7 206.737 1237.01 203.851C1240.36 200.846 1242.77 197.084 1244.24 192.566C1246.03 187.097 1246.49 182.455 1245.63 178.639C1244.77 174.824 1242.58 171.244 1239.07 167.899C1235.56 164.554 1230.28 160.78 1223.23 156.576C1221.8 155.727 1220.3 154.86 1218.75 153.974C1217.32 153.125 1215.78 152.18 1214.15 151.137C1206.39 146.706 1199.98 142.375 1194.91 138.144C1189.96 133.951 1186.34 128.93 1184.04 123.083C1181.86 117.274 1181.99 110.624 1184.43 103.133C1187.73 93.0274 1194.14 86.2717 1203.67 82.8664C1213.32 79.4989 1224.82 79.9332 1238.17 84.1692C1246.99 86.9679 1254.3 90.9909 1260.08 96.238C1265.91 101.366 1269.9 107.486 1272.05 114.598C1274.2 121.71 1274.28 129.54 1272.28 138.09L1258.69 133.778C1260.48 124.245 1259.45 116.309 1255.6 109.97C1251.75 103.631 1244.64 98.8168 1234.27 95.5264C1224.97 92.5763 1217.18 92.0715 1210.89 94.0121C1204.6 95.9526 1200.44 100.014 1198.43 106.197C1196.64 111.666 1196.44 116.324 1197.81 120.172C1199.35 123.939 1201.93 127.316 1205.56 130.304C1209.19 133.293 1214.48 136.81 1221.45 140.858C1221.89 141.128 1222.33 141.398 1222.77 141.668C1223.2 141.938 1223.7 142.227 1224.26 142.535Z"
                    data-svg-origin="1216.5928344726562 151.1736068725586"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                  <path
                    className="fill-black"
                    d="M1289.64 251.052L1335.49 137.86L1293.07 121.155L1297.58 110.027L1395.15 148.455L1390.64 159.583L1348.23 142.878L1302.38 256.07L1289.64 251.052Z"
                    data-svg-origin="1342.39501953125 183.04850006103516"
                    transform="matrix(1,0,0,1,0,0)"
                  ></path>
                </svg>
              </div>

              {/* <svg
                className={styles['svg-bubbles']}
                width="1456"
                height="363"
                viewBox="0 0 1456 363"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="1142.34" cy="146" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="411.344" cy="105" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="149.344" cy="196" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="649.344" cy="94" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="781.344" cy="32" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="1098.34" cy="76" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
                <circle cx="315.344" cy="7" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25"></circle>
              </svg> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
