import React from 'react';
import Main from '../../../app/javascript/services/settings';
import renderer from 'react-test-renderer';
import expectationResultFactory from 'jest-jasmine2/build/expectationResultFactory';

test('component exists', () => {
  expectationResultFactory(SETTINGS.periodRangeLength).toBe(1);
})
