import * as utilsActions from '../actions/utils';

export default function utilsMiddleware({dispatch}) {
    return next => action => {
        const {payload, error, meta = {}} = action;
        const {sequence = {}, autoTipSuccess, autoTipError = '未知系统错误'} = meta;

        const dispatchToast = (...args) => {
            dispatch(utilsActions.toast(...args));
        };

        // error handle
        if (autoTipError && error) {
            let text = autoTipError;
            console.error(payload);
            if (payload.type === 'http') {
                if (text === '未知系统错误') {
                    text = (payload.body && payload.body.message) || autoTipError;
                }

                dispatchToast({
                    type: 'error',
                    text,
                });
            } else {
                dispatchToast({
                    type: 'error',
                    text,
                });
            }
        }
        if (sequence.type === 'next' && !error && autoTipSuccess) {
            dispatchToast({
                type: 'success',
                text: `${autoTipSuccess}`,
            });
        }
        next(action);
    };
}
