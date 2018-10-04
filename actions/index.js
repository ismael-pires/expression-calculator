/**
 * Expression Calculator - Action Creators
 *
 * @Ismael Pires
 */

import {ADD_DATA, CLEAR_DATA} from './actions';

export const addData = (_value) => {
	return (
		type: ADD_DATA,
		value: _value 
	);
}

export const clearData = () => {
	return (
		type: CLEAR_DATA
	);
}