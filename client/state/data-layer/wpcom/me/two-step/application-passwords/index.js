/** @format */

/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import deleteHandler from './delete';
import newHandler from './new';
import { APPLICATION_PASSWORDS_REQUEST } from 'state/action-types';
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';
import { http } from 'state/data-layer/wpcom-http/actions';
import { mergeHandlers } from 'state/action-watchers/utils';
import { receiveApplicationPasswords } from 'state/application-passwords/actions';

export function fromApi( response ) {
	if ( ! response.application_passwords ) {
		throw new Error( 'An error has occurred while requesting application passwords.', response );
	}

	return response.application_passwords;
}

/**
 * Dispatches a request to fetch application passwords of the current user
 *
 * @param   {Object} action Redux action
 * @returns {Object} Dispatched http action
 */
export const requestApplicationPasswords = action =>
	http(
		{
			apiVersion: '1.1',
			method: 'GET',
			path: '/me/two-step/application-passwords',
		},
		action
	);

/**
 * Dispatches a user application passwords receive action when the request succeeded.
 *
 * @param   {Object} action       Redux action
 * @param   {Object} appPasswords Application passwords
 * @returns {Object} Dispatched user application passwords receive action
 */
export const handleRequestSuccess = ( action, appPasswords ) =>
	receiveApplicationPasswords( appPasswords );

const requestHandler = {
	[ APPLICATION_PASSWORDS_REQUEST ]: [
		dispatchRequestEx( {
			fetch: requestApplicationPasswords,
			onSuccess: handleRequestSuccess,
			onError: noop,
			fromApi,
		} ),
	],
};

export default mergeHandlers( requestHandler, newHandler, deleteHandler );
