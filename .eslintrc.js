module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "quotes": "off", // 强制使用一致的双引号或单引号
    "indent": ["warn", 2], // 缩进风格
    "semi": "off", // 强制在语句末尾使用分号
    "comma-dangle": "off", //  禁止末尾逗号
    "prefer-const": "off",
    "lines-between-class-members": "off", // 强制类成员之间的空行来提高可读性
    "no-prototype-builtins": "off", // 禁止直接实用Object.prototype上的内置属性
    "vue/script-indent": ["error", 2, { "baseIndent": 1 }],
    "no-useless-call": "off"
  },
  overrides: [
    {
      "files": ["*.vue"],
      "rules": {
        "indent": "off"
      }
    }
  ],
  globals: {
    'serverConfig': false
  }
}
