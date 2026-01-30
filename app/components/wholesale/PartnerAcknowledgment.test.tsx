import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {PartnerAcknowledgment} from './PartnerAcknowledgment';

describe('PartnerAcknowledgment', () => {
  it('renders acknowledgment message with partner name and store count', () => {
    render(<PartnerAcknowledgment partnerName="Sarah" storeCount={3} />);

    const message = screen.getByText(
      /Isla Suds is in 3 local stores.*Thanks for being one of them, Sarah/i,
    );
    expect(message).toBeInTheDocument();
  });

  it('renders with different partner name', () => {
    render(<PartnerAcknowledgment partnerName="Michael" storeCount={3} />);

    const message = screen.getByText(
      /Thanks for being one of them, Michael/i,
    );
    expect(message).toBeInTheDocument();
  });

  it('renders with different store count', () => {
    render(<PartnerAcknowledgment partnerName="Sarah" storeCount={5} />);

    const message = screen.getByText(/Isla Suds is in 5 local stores/i);
    expect(message).toBeInTheDocument();
  });

  it('handles fallback when firstName is empty string', () => {
    render(<PartnerAcknowledgment partnerName="" storeCount={3} />);

    const message = screen.getByText(/Thanks for being one of them,/i);
    expect(message).toBeInTheDocument();
  });

  it('renders with "Partner" when name is provided as fallback', () => {
    // Loader provides 'Partner' when firstName is null
    render(<PartnerAcknowledgment partnerName="Partner" storeCount={3} />);

    const message = screen.getByText(/Thanks for being one of them, Partner/i);
    expect(message).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const {container} = render(
      <PartnerAcknowledgment partnerName="Sarah" storeCount={3} />,
    );

    const wrapper = container.querySelector('.mb-8');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('bg-canvas-elevated');
    expect(wrapper).toHaveClass('p-6');
  });

  it('is not interactive - no tabindex or click handlers', () => {
    const {container} = render(
      <PartnerAcknowledgment partnerName="Sarah" storeCount={3} />,
    );

    const wrapper = container.querySelector('.mb-8');
    expect(wrapper).not.toHaveAttribute('tabindex');
    expect(wrapper).not.toHaveAttribute('role', 'button');
    expect(wrapper).not.toHaveAttribute('onClick');
  });
});
