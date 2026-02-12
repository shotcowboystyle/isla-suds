import {useState} from 'react';
import {FaArrowRight} from 'react-icons/fa6';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Email submitted:', email);
  };

  return (
    <div className="w-full max-w-2xl">
      <p className="mb-6 text-center text-gray-300">
        Get Exclusive Early Access and Stay Informed About Product
        <br />
        Updates, Events, and More!
      </p>

      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onSubmit={handleSubmit}
          placeholder="Enter your email"
          className="w-full border-b-2 border-gray-600 bg-transparent px-2 py-4 text-lg text-gray-400 placeholder-gray-600 transition-colors focus:border-white focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="absolute top-1/2 right-2 -translate-y-1/2 transition-transform hover:translate-x-1"
          aria-label="Submit"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};
