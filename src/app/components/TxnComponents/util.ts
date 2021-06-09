import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { NETWORK_ID } from 'utils/constants';

export const getAddress = data => format.address(data, NETWORK_ID);

/**
 *
 * @param data
 * @param type
 * @returns
 * @todo
 * 1. convert hex data
 * 2. handle JSON.stringify issue
 */
export const formatData = (data, type) => {
  try {
    // handle string type specially, translate to hex format
    // if (type === 'string') {
    //   const bytes = format.bytes(data);
    //   const hex = format.hex(bytes);
    //   return hex;
    // }
    if (type.startsWith('bytes')) {
      return format.hex(data);
    }
    // bigint value, should convert first, because Object.prototype.toString.call(data) = '[object Array]'
    if (data.sign !== undefined) {
      return data.toString();
    }
    // bytes[], uint[], int[], tuple
    // @todo use JSON.stringify to decode data, will cause inner value to be wrapped with quotation mark, like "string" type
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return JSON.stringify(data);
    }
    // others: address, uint, int,
    return data.toString();
  } catch (e) {
    return data.toString();
  }
};

// @todo, use this for eventlogs
export const disassembleEvent = (decodedLog, log) => {
  try {
    var r = /(.*?)(?=\()(\((.*)\))$/;
    const result = r.exec(decodedLog.fullName);

    if (result !== null) {
      let args:
        | string
        | Array<{
            argName: string;
            type: string;
            indexed: number;
            originalValue?: any; // original value
            value?: any;
            formattedValue?: any; // decoded value with formatData method, equal to value
            hexValue?: string; // @todo, hex formatted value
            hexAddress?: string; // hex formatted address
            cfxAddress?: string; // base32 formatted address
          }> = result[3];
      let indexCount = 1;

      args = args
        .split(', ')
        .filter(a => a !== '')
        .map(i => {
          let item = i.trim().split(' ');
          const type = item[0];

          let r = {
            argName: '',
            type: type,
            indexed: 0, // 0 is mean not indexed
            value: null,
            originalValue: '',
            formattedValue: '',
            hexValue: '',
            hexAddress: '',
            cfxAddress: '',
          };

          let valueIndex = 1;

          // for eventlog topic decode
          if (item.length === 3) {
            r.indexed = indexCount;
            r.hexValue = log.topics[indexCount];

            valueIndex = 2;
            indexCount += 1;
          }

          const argName = item[valueIndex];
          const value = formatData(decodedLog.object[argName], r.type);

          r.argName = argName;
          r.originalValue = decodedLog.object[argName];
          r.value = value;
          r.formattedValue = value;

          // try to get hex address and base32 address
          try {
            r.hexAddress = format.hexAddress(r.formattedValue); // try to format cfx address to hex address
            r.cfxAddress = getAddress(r.formattedValue);
          } catch (e) {}

          return r;
        });

      return args;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};
