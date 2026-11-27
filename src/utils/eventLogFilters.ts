import { eventLogScan } from '@cfxjs/sirius-next-common/dist/utils/eventLogScan';

export const {
  fields: eventLogFields,
  read: readEventLogFilters,
  validate: validateEventLogFilters,
} = eventLogScan.core;

export const eventLogErrorKeys = {
  invalidHeight: 'invalidEpoch',
  reversedRange: 'fromEpochGtToEpoch',
  invalidTopic0: 'invalidTopic0',
} as const;
