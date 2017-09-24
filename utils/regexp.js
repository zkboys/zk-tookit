/*
 * 通用正则表达式
 * TODO: 编写测试，需要好好验证一下这里面的正则
 * */

// 手机号
export const mobile = /^1\d{10}$/; // /^1[3|4|5|7|8][0-9]{9}$/;

// 座机号
export const landLine = /^([0-9]{3,4}-)?[0-9]{7,8}$/;

// qq号
export const qq = /^[1-9][0-9]{4,9}$/;

// 身份证号
export const cardNumber = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;

// 邮箱
export const email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

// 纯数字，不包括 + -
export const number = /^[0-9]*$/; // fixme: '0000' 这个正则也可以

// 整数
export const integer = /^[-]?[0-9]+$/; // fixme: '0000' 这个正则也可以

// 正整数 fixme 这个是自然数，不是正整数，正整数不包含0
export const positiveInteger = /^[1-9]\d*$|^0?$/;

// 正整数
// export const positiveInteger = /^[1-9]\d*$/;

// 自然数
export const naturalNumber = /^[1-9]\d*$|^0?$/;

// 大于0的正整数 fixme 正整数，就特么是大于0的
export const positiveIntegerGT0 = /^[1-9]+[0-9]*$/;

// 数字、保存两位小数
export const numberWithTwoDecimal = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
