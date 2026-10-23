import { type Config } from 'vike/types';
import vikeReact from 'vike-react/config';

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  description: 'Demo showcasing Vike',

  extends: [vikeReact],
  // https://vike.dev/head-tags
  title: 'My Vike App',
};

export default config;
