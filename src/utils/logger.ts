import * as winston from 'winston';

const winstLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => {
        return new Date().toDateString();
      },
      // tslint:disable-next-line:object-literal-sort-keys
      formatter: options => {
        return (
          `${options.timestamp()} ${winston.config.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')}`
        );
      }
    })
  ]
});
export default winstLogger;
