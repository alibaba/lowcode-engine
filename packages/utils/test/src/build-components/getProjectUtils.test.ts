import { getProjectUtils } from "../../../src/build-components";

const sampleUtil = () => 'I am a sample util';
const sampleUtil2 = () => 'I am a sample util 2';

describe('get project utils', () => {
  it('get utils with destructuring true', () => {
    expect(getProjectUtils(
      {
        '@alilc/utils': {
          destructuring: true,
          sampleUtil,
          sampleUtil2,
        }
      },
      [{
        name: 'sampleUtils',
        npm: {
          package: '@alilc/utils'
        }
      }]
    )).toEqual({
      sampleUtil,
      sampleUtil2,
    })
  });

  it('get utils with name', () => {
    expect(getProjectUtils(
      {
        '@alilc/utils': sampleUtil
      },
      [{
        name: 'sampleUtil',
        npm: {
          package: '@alilc/utils'
        }
      }]
    )).toEqual({
      sampleUtil,
    })
  });
})