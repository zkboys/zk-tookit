import packageJson from '../../package.json';

const debug = process.env.NODE_ENV !== 'production';
export default {
    debug,
    signInPath: debug ? '/signin.html' : '/signin.html',
    package: packageJson,
};
