import {LiquidButton} from '~/components/ui/LiquidButton';

export function PerksSection() {
  const perks = [
    {
      number: '01',
      title: 'JOIN THE TEAM',
      description:
        'Become part of a growing network of retailers who prioritize quality and sustainability. We support our partners with marketing materials and dedicated service.',
    },
    {
      number: '02',
      title: 'CONNECT WITH FANS',
      description:
        'Isla Suds customers are loyal and enthusiastic. Bring them into your store by offering their favorite products locally.',
    },
    {
      number: '03',
      title: 'SHARE AND SHINE',
      description:
        'We love to shout out our partners on social media. Let us help drive traffic to your location and grow together.',
    },
  ];

  return (
    <section className="bg-[#3D2B1F] pb-24 pt-12 text-[#F2E9E1]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="flex flex-col bg-[#F2E9E1] p-8 text-[#3D2B1F] transform transition-transform hover:-translate-y-2 md:rotate-[-2deg] md:hover:rotate-0"
            >
              <span className="mb-4 text-sm font-bold opacity-50">{perk.number}</span>
              <h3 className="mb-4 font-display text-3xl font-black uppercase leading-none">{perk.title}</h3>
              <p className="font-medium leading-relaxed">{perk.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <LiquidButton
            href="/dairy-dealers-application-form"
            text="APPLY TODAY"
            className="bg-[#D99E5C] text-black hover:bg-[#c68945]"
            backgroundColor="#D99E5C"
          />
        </div>
      </div>
    </section>
  );
}
