import {getPkgNameAndVersion} from '../src/localize';

test('getPkgNameAndVersion from string', () => {
    const result = getPkgNameAndVersion('react');
    expect(result).toEqual({"name": "react"});
});