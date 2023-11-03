import {
    addColors,
    createLogger,
    format,
    transports,
    type Logform,
    type Logger,
} from 'winston';

/**
 * Placeholder logger function
 */
export type LoggerFunction = (message: string) => Logger;

export type LoggerObject = {
    error: LoggerFunction;
    warn: LoggerFunction;
    info: LoggerFunction;
    verbose: LoggerFunction;
};

addColors({
    verbose: 'blackBG dim bold',
    info: 'greenBG white bold',
    warn: 'yellowBG black bold',
    error: 'redBG white bold',
    verboseMsg: 'dim',
    infoMsg: 'green',
    warnMsg: 'yellow',
    errorMsg: 'red',
    meaningless: 'gray',
});

export const logger = createLogger({
    level: 'verbose',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.printf(
            (info): string =>
                `${info.timestamp} [${
                    info.label ?? 'Unknown'
                }] ${info.level.toUpperCase()}: ${info.message}`,
        ),
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format((info): Logform.TransformableInfo => {
                    const colorizer = format.colorize();
                    info.timestamp = colorizer.colorize(
                        'meaningless',
                        info.timestamp,
                    );
                    info.label = colorizer.colorize(
                        'meaningless',
                        info.label ?? 'Unknown',
                    );
                    info.message = colorizer.colorize(
                        `${info.level}Msg`,
                        info.message,
                    );
                    info.level = ` ${info.level.toUpperCase()} `;
                    return info;
                })(),
                format.errors({ stack: true }),
                format.timestamp(),
                format.colorize(),
                format.printf(
                    (info): string =>
                        `${info.timestamp} ${info.level} ${
                            info.label ?? 'Unknown'
                        } ${info.message}`,
                ),
            ),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/log.log' }),
    ],
});
