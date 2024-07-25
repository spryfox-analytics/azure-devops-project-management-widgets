// Imports
import '@testing-library/jest-dom/extend-expect'
import {
    fireEvent,
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved
} from '@testing-library/react';
import React from 'react';
import { mockSetFieldValue, spyWorkItemCallBackAccessor } from '../../__mocks__/azure-devops-extension-sdk'

// AzDO related Mocks are loaded automatically (implementations /src/__mocks__)

// Loading samples related mocks
jest.mock('../../Common');

describe('dummy', () => {
    test('dummy', () => {
        expect(1).toEqual(1);
    });
});


/**
 * Helper Function to delay execution
 */
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
