import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  if(config.build !== undefined ){
    //config.build.minify = false
  }
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
