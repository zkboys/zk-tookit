import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as profileService from '../../services/system/profile';

export const updateUserMessage = createAction(types.UPDATE_USER_MESSAGE,
    async(userMessage) => await profileService.updateUserMessage(userMessage), // 返回一个promise实例
    (userMessage, resolved, rejected) => {
        return {
            resolved, // 执行异步action成功回调，使页面可以获取异步成功
            rejected, // 执行异步action失败回调，使页面可以处理异步失败
            autoTipError: '修改个人信息失败', // 系统自动提示错误， 默认 ‘未知系统错误’ 传递false，不使用系统提示
            autoTipSuccess: '个人信息修改成功', // 默认 false，不显示成功提示信息，
        };
    }
);

export const saveUserPass = createAction(types.UPDATE_USER_PASS,
    async(userPass) => await profileService.updateUserPass(userPass),
    (userPass, resolved, rejected) => {
        return {
            resolved,
            rejected,
            autoTipSuccess: '密码修改成功',
        };
    }
);
